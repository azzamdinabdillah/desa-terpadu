<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class AnnouncementController extends Controller
{
    public function index()
    {
        return Inertia::render('announcement/announcement');
    }
}
