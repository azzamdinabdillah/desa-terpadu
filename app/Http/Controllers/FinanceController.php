<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class FinanceController extends Controller
{
    /**
     * Display the finance page.
     */
    public function index()
    {
        return inertia('finance/finance');
    }
}
