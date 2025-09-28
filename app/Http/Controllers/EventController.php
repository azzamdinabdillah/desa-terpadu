<?php

namespace App\Http\Controllers;

use App\Models\Event;
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
}
