<?php

namespace App\Mail;

use App\Models\SocialAidProgram;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SocialAidNewProgramNotification extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public SocialAidProgram $program;

    public function __construct(SocialAidProgram $program)
    {
        $this->program = $program;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '🎯 Program Bansos Baru - ' . $this->program->program_name,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.social-aid-new-program',
            with: [
                'program' => $this->program,
                'appUrl' => config('app.url'),
            ]
        );
    }

    public function attachments(): array
    {
        return [];
    }
}


