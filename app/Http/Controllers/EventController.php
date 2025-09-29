<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Citizen;
use App\Models\EventParticipant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class EventController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
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

        $events = $query->with(['createdBy', 'participants', 'documentations'])
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
     * Show the form for creating a new event.
     */
    public function create()
    {
        return Inertia::render('event/create');
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
            'date_start' => 'required|date|after:now',
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
            'date_start.after' => 'Tanggal mulai harus setelah waktu sekarang.',
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

            Event::create($data);

            return redirect()->route('events.index')->with('success', 'Event berhasil dibuat!');

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
            'createdBy', 
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
    public function register(Event $event)
    {
        $event->load(['createdBy', 'participants.citizen', 'documentations']);

        return Inertia::render('event/register', [
            'event' => $event
        ]);
    }

    /**
     * Store a new registration for an event.
     */
    public function storeRegistration(Request $request, Event $event)
    {
        $request->validate([
            'nik' => 'required|string|size:16'
        ]);

        // Find citizen by NIK
        $citizen = Citizen::where('nik', $request->nik)->first();

        if (!$citizen) {
            return back()->withErrors(['nik' => 'NIK tidak ditemukan dalam sistem desa.']);
        }

        // Check if citizen is already registered
        $existingRegistration = EventParticipant::where('event_id', $event->id)
            ->where('citizen_id', $citizen->id)
            ->first();

        if ($existingRegistration) {
            return back()->withErrors(['nik' => 'Anda sudah terdaftar untuk event ini.']);
        }

        // Check if event is full (if max_participants is set)
        if ($event->max_participants) {
            $currentParticipants = EventParticipant::where('event_id', $event->id)->count();
            if ($currentParticipants >= $event->max_participants) {
                return back()->withErrors(['nik' => 'Event ini sudah penuh.']);
            }
        }

        // Check if event is finished
        if ($event->status === 'finished') {
            return back()->withErrors(['nik' => 'Event ini sudah selesai dan tidak menerima pendaftaran baru.']);
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
            }

            return redirect()->route('events.show', $event->id)
                ->with('success', 'Status event berhasil diubah dan dokumentasi berhasil diupload!');

        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Terjadi kesalahan saat menyimpan data. Silakan coba lagi.');
        }
    }
}
