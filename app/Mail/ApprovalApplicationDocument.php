<?php

namespace App\Mail;

use App\Models\ApplicationDocument;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ApprovalApplicationDocument extends Mailable
{
    use Queueable;
    use SerializesModels;

    public $application;
    public $isApproved;
    public $adminNote;

    /**
     * Create a new message instance.
     */
    public function __construct(ApplicationDocument $application, bool $isApproved, string $adminNote = '')
    {
        $this->application = $application;
        $this->isApproved = $isApproved;
        $this->adminNote = $adminNote;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $status = $this->isApproved ? 'Disetujui' : 'Ditolak';
        return new Envelope(
            subject: "Pengajuan Surat {$status} - {$this->application->masterDocument->document_name}",
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.approval_applicant_document',
            with: [
                'application' => $this->application,
                'isApproved' => $this->isApproved,
                'adminNote' => $this->adminNote,
            ]
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}

