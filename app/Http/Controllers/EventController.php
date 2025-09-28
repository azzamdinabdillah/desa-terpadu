<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Citizen;
use App\Models\EventParticipant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EventController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $events = Event::with(['createdBy', 'participants', 'documentations'])
            ->orderBy('date_start', 'desc')
            ->get();

        return Inertia::render('event/event', [
            'events' => $events
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

        return back()->with('success', 'Pendaftaran berhasil! Anda telah terdaftar untuk event ini.');
    }
}
