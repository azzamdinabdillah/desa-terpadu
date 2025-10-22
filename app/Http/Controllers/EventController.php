<?php

namespace App\Http\Controllers;

use App\Mail\NewEventNotification;
use App\Models\Event;
use App\Models\Citizen;
use App\Models\EventParticipant;
use App\Models\EventsDocumentation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class EventController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Update event statuses based on current date FIRST
        // $this->updateEventStatuses();
        
        $search = $request->string('q')->toString();
        $status = $request->string('status')->toString();
        $type = $request->string('type')->toString();

        $query = Event::query();

        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('event_name', 'like', "%{$search}%")
                  ->orWhere('location', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($status !== '') {
            $query->where('status', $status);
        }

        if ($type !== '') {
            $query->where('type', $type);
        }

        $events = $query->with(['createdBy.citizen', 'participants', 'documentations'])
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->onEachSide(0)
            ->withQueryString();

        return Inertia::render('event/event', [
            'events' => $events,
            'filters' => [
                'q' => $search,
                'status' => $status,
                'type' => $type,
            ],
        ]);
    }


    /**
     * Update event statuses based on current date.
     */
    // private function updateEventStatuses(): void
    // {
    //     $now = now();
        
    //     // Update events that should be finished FIRST (highest priority)
    //     Event::where('date_end', '<', $now)
    //         ->update(['status' => 'finished']);
            
    //     // Update events that should be ongoing (only if not finished)
    //     Event::where('date_start', '<=', $now)
    //         ->where('date_end', '>=', $now)
    //         ->update(['status' => 'ongoing']);
            
    //     // Update events that should be pending (only if not finished or ongoing)
    //     Event::where('date_start', '>', $now)
    //         ->update(['status' => 'pending']);
    // }

    /**
     * Show the form for creating a new event.
     */
    public function create()
    {
        return Inertia::render('event/create');
    }

    /**
     * Show the form for editing the specified event.
     */
    public function edit(Event $event)
    {
        return Inertia::render('event/create', [
            'event' => $event,
            'isEdit' => true
        ]);
    }

    /**
     * Store a newly created event in storage.
     */
    public function store(Request $request)
    {
        // Define base validation rules
        $rules = [
            'event_name' => 'required|string|max:255',
            'description' => 'nullable|string|max:2000',
            'date_start' => 'required|date',
            'date_end' => 'required|date|after:date_start',
            'location' => 'required|string|max:255',
            'flyer' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:10240', // 10MB max
            'status' => 'required|in:pending,ongoing,finished',
            'type' => 'required|in:public,restricted',
        ];

        // Add conditional validation for max_participants
        if ($request->type === 'restricted') {
            $rules['max_participants'] = 'required|integer|min:1';
        } else {
            $rules['max_participants'] = 'nullable|integer|min:1';
        }

        $request->validate($rules, [
            'event_name.required' => 'Nama event wajib diisi.',
            'event_name.string' => 'Nama event harus berupa teks.',
            'event_name.max' => 'Nama event maksimal 255 karakter.',
            'description.string' => 'Deskripsi harus berupa teks.',
            'description.max' => 'Deskripsi maksimal 2000 karakter.',
            'date_start.required' => 'Tanggal mulai wajib diisi.',
            'date_start.date' => 'Format tanggal mulai tidak valid.',
            'date_end.required' => 'Tanggal selesai wajib diisi.',
            'date_end.date' => 'Format tanggal selesai tidak valid.',
            'date_end.after' => 'Tanggal selesai harus setelah tanggal mulai.',
            'location.required' => 'Lokasi wajib diisi.',
            'location.string' => 'Lokasi harus berupa teks.',
            'location.max' => 'Lokasi maksimal 255 karakter.',
            'flyer.file' => 'Flyer harus berupa file.',
            'flyer.mimes' => 'Flyer harus berupa file jpeg, png, jpg, atau pdf.',
            'flyer.max' => 'Ukuran file flyer maksimal 10MB.',
            'status.required' => 'Status event wajib dipilih.',
            'status.in' => 'Status event tidak valid.',
            'type.required' => 'Tipe event wajib dipilih.',
            'type.in' => 'Tipe event tidak valid.',
            'max_participants.required' => 'Jumlah peserta maksimal wajib diisi untuk event terbatas.',
            'max_participants.integer' => 'Jumlah peserta maksimal harus berupa angka.',
            'max_participants.min' => 'Jumlah peserta maksimal minimal 1.',
        ]);

        try {
            $data = [
                'event_name' => $request->event_name,
                'description' => $request->description,
                'date_start' => $request->date_start,
                'date_end' => $request->date_end,
                'location' => $request->location,
                'status' => $request->status,
                'type' => $request->type,
                'max_participants' => $request->max_participants,
                'created_by' => Auth::id(), // Set the current user as creator
            ];

            // Handle file upload
            if ($request->hasFile('flyer')) {
                $file = $request->file('flyer');
                $filename = time() . '_' . $file->getClientOriginalName();
                $path = $file->storeAs('event_flyers', $filename, 'public');
                $data['flyer'] = $path;
            }

            $event = Event::create($data);

            // Send email notification to all citizens
            $this->sendEventNotification($event);

            return redirect()->route('events.index')->with('success', 'Event berhasil dibuat!');

        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Terjadi kesalahan saat menyimpan data. Silakan coba lagi.');
        }
    }

    /**
     * Update the specified event in storage.
     */
    public function update(Request $request, Event $event)
    {
        // Define base validation rules
        $rules = [
            'event_name' => 'required|string|max:255',
            'description' => 'nullable|string|max:2000',
            'date_start' => 'required|date',
            'date_end' => 'required|date|after:date_start',
            'location' => 'required|string|max:255',
            'flyer' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:10240', // 10MB max
            'type' => 'required|in:public,restricted',
        ];

        // Add conditional validation for max_participants
        if ($request->type === 'restricted') {
            $rules['max_participants'] = 'required|integer|min:1';
        } else {
            $rules['max_participants'] = 'nullable|integer|min:1';
        }

        // Check if max_participants is being reduced below current participants
        if ($request->type === 'restricted' && $request->max_participants) {
            $currentParticipants = EventParticipant::where('event_id', $event->id)->count();
            if ($request->max_participants < $currentParticipants) {
                return redirect()->back()->withErrors([
                    'max_participants' => "Jumlah peserta maksimal tidak boleh kurang dari {$currentParticipants} (jumlah peserta yang sudah terdaftar)."
                ]);
            }
        }

        $request->validate($rules, [
            'event_name.required' => 'Nama event wajib diisi.',
            'event_name.string' => 'Nama event harus berupa teks.',
            'event_name.max' => 'Nama event maksimal 255 karakter.',
            'description.string' => 'Deskripsi harus berupa teks.',
            'description.max' => 'Deskripsi maksimal 2000 karakter.',
            'date_start.required' => 'Tanggal mulai wajib diisi.',
            'date_start.date' => 'Format tanggal mulai tidak valid.',
            'date_end.required' => 'Tanggal selesai wajib diisi.',
            'date_end.date' => 'Format tanggal selesai tidak valid.',
            'date_end.after' => 'Tanggal selesai harus setelah tanggal mulai.',
            'location.required' => 'Lokasi wajib diisi.',
            'location.string' => 'Lokasi harus berupa teks.',
            'location.max' => 'Lokasi maksimal 255 karakter.',
            'flyer.file' => 'Flyer harus berupa file.',
            'flyer.mimes' => 'Flyer harus berupa file jpeg, png, jpg, atau pdf.',
            'flyer.max' => 'Ukuran file flyer maksimal 10MB.',
            'type.required' => 'Tipe event wajib dipilih.',
            'type.in' => 'Tipe event tidak valid.',
            'max_participants.required' => 'Jumlah peserta maksimal wajib diisi untuk event terbatas.',
            'max_participants.integer' => 'Jumlah peserta maksimal harus berupa angka.',
            'max_participants.min' => 'Jumlah peserta maksimal minimal 1.',
        ]);

        try {
            $data = [
                'event_name' => $request->event_name,
                'description' => $request->description,
                'date_start' => $request->date_start,
                'date_end' => $request->date_end,
                'location' => $request->location,
                'type' => $request->type,
                'max_participants' => $request->max_participants,
            ];

            // Handle file upload
            if ($request->hasFile('flyer')) {
                // Delete old flyer if exists
                if ($event->flyer && Storage::disk('public')->exists($event->flyer)) {
                    Storage::disk('public')->delete($event->flyer);
                }
                
                $file = $request->file('flyer');
                $filename = time() . '_' . $file->getClientOriginalName();
                $path = $file->storeAs('event_flyers', $filename, 'public');
                $data['flyer'] = $path;
            }

            $event->update($data);

            return redirect()->route('events.index')->with('success', 'Event berhasil diperbarui!');

        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Terjadi kesalahan saat menyimpan data. Silakan coba lagi.');
        }
    }

    /**
     * Display the specified event.
     */
    public function show(Event $event)
    {
        $event->load([
            'createdBy.citizen', 
            'participants.citizen', 
            'documentations'
        ]);

        return Inertia::render('event/detail', [
            'event' => $event
        ]);
    }

    /**
     * Show the registration page for an event.
     */
    public function register(Request $request, Event $event)
    {
        $event->load(['createdBy.citizen', 'participants.citizen', 'documentations']);

        // Get logged in user with citizen data
        $user = $request->user()->load('citizen');

        return Inertia::render('event/register', [
            'event' => $event,
            'userCitizen' => $user->citizen
        ]);
    }

    /**
     * Store a new registration for an event.
     */
    public function storeRegistration(Request $request, Event $event)
    {
        // Get citizen from logged in user
        $user = $request->user()->load('citizen');
        $citizen = $user->citizen;

        if (!$citizen) {
            return back()->withErrors(['error' => 'Data warga tidak ditemukan. Silakan hubungi administrator.']);
        }

        // Check if citizen is already registered
        $existingRegistration = EventParticipant::where('event_id', $event->id)
            ->where('citizen_id', $citizen->id)
            ->first();

        if ($existingRegistration) {
            return back()->withErrors(['error' => 'Anda sudah terdaftar untuk event ini.']);
        }

        // Check if event is full (if max_participants is set)
        if ($event->max_participants) {
            $currentParticipants = EventParticipant::where('event_id', $event->id)->count();
            if ($currentParticipants >= $event->max_participants) {
                return back()->withErrors(['error' => 'Event ini sudah penuh.']);
            }
        }

        // Check if event is finished
        if ($event->status === 'finished') {
            return back()->withErrors(['error' => 'Event ini sudah selesai dan tidak menerima pendaftaran baru.']);
        }

        // Create registration
        EventParticipant::create([
            'event_id' => $event->id,
            'citizen_id' => $citizen->id
        ]);

        return redirect()->route('events.show', $event->id)
            ->with('success', 'Pendaftaran berhasil! Anda telah terdaftar untuk event ini.');
    }

    /**
     * Show the form for changing event status.
     */
    public function changeStatus(Event $event)
    {
        $event->load(['createdBy', 'participants.citizen', 'documentations']);

        return Inertia::render('event/change-status', [
            'event' => $event
        ]);
    }

    /**
     * Update the event status and handle documentation upload.
     */
    public function updateStatus(Request $request, Event $event)
    {
        $request->validate([
            'status' => 'required|in:pending,ongoing,finished',
            'documentation_files.*' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:10240', // 10MB max
            'documentation_captions.*' => 'nullable|string|max:1000',
        ], [
            'status.required' => 'Status event wajib dipilih.',
            'status.in' => 'Status event tidak valid.',
            'documentation_files.*.file' => 'File dokumentasi harus berupa file.',
            'documentation_files.*.mimes' => 'File dokumentasi harus berupa jpeg, png, jpg, atau pdf.',
            'documentation_files.*.max' => 'Ukuran file dokumentasi maksimal 10MB.',
            'documentation_captions.*.string' => 'Caption dokumentasi harus berupa teks.',
            'documentation_captions.*.max' => 'Caption dokumentasi maksimal 1000 karakter.',
        ]);

        try {
            // Update event status
            $event->update([
                'status' => $request->status
            ]);

            // Handle documentation upload if provided
            $documentationUploaded = false;
            if ($request->hasFile('documentation_files')) {
                $files = $request->file('documentation_files');
                $captions = $request->input('documentation_captions', []);
                
                foreach ($files as $index => $file) {
                    $filename = time() . '_' . $index . '_' . $file->getClientOriginalName();
                    $path = $file->storeAs('event_documentations', $filename, 'public');
                    
                    // Get caption for this file (if exists)
                    $caption = isset($captions[$index]) ? $captions[$index] : '';
                    
                    // Create documentation record for each file
                    \App\Models\EventsDocumentation::create([
                        'event_id' => $event->id,
                        'caption' => $caption,
                        'path' => $path,
                        'uploaded_by' => Auth::id(),
                    ]);
                }
                $documentationUploaded = true;
            }

            // Set appropriate success message
            $message = $documentationUploaded 
                ? 'Status event berhasil diubah dan dokumentasi berhasil diupload!'
                : 'Status event berhasil diubah!';

            return redirect()->route('events.show', $event->id)
                ->with('success', $message);

        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Terjadi kesalahan saat menyimpan data. Silakan coba lagi.');
        }
    }

    /**
     * Remove the specified event from storage.
     */
    public function destroy(Event $event)
    {
        try {
            // Delete flyer file if exists
            if ($event->flyer && Storage::disk('public')->exists($event->flyer)) {
                Storage::disk('public')->delete($event->flyer);
            }

            // Delete documentation files and records
            $documentations = EventsDocumentation::where('event_id', $event->id)->get();
            foreach ($documentations as $doc) {
                if ($doc->path && Storage::disk('public')->exists($doc->path)) {
                    Storage::disk('public')->delete($doc->path);
                }
                $doc->delete();
            }

            // Delete participants
            EventParticipant::where('event_id', $event->id)->delete();

            // Finally delete event
            $event->delete();

            return redirect()->route('events.index')->with('success', 'Event berhasil dihapus.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal menghapus event. Silakan coba lagi.');
        }
    }

    /**
     * Send event notification to all citizens
     */
    private function sendEventNotification(Event $event)
    {
        try {
            // Get all citizens with email addresses
            $citizens = Citizen::whereNotNull('email')
                ->where('email', '!=', '')
                ->get();

            if ($citizens->count() > 0) {
                // Send email to each citizen (using queue for better performance)
                foreach ($citizens as $citizen) {
                    Mail::to($citizen->email)->queue(new NewEventNotification($event));
                }
            }
        } catch (\Exception $e) {
            // Log error but don't break the event creation process
            \Log::error('Failed to send event notification: ' . $e->getMessage());
        }
    }
}
