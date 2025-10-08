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
    public $isNotification;
    public $isCompleted;

    /**
     * Create a new message instance.
     */
    public function __construct(ApplicationDocument $application, bool $isApproved, string $adminNote = '', bool $isNotification = false, bool $isCompleted = false)
    {
        $this->application = $application;
        $this->isApproved = $isApproved;
        $this->adminNote = $adminNote;
        $this->isNotification = $isNotification;
        $this->isCompleted = $isCompleted;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        if ($this->isCompleted) {
            $subject = "Pengajuan Surat Selesai - {$this->application->masterDocument->document_name}";
        } elseif ($this->isNotification) {
            $subject = "Pemberitahuan Pengajuan Surat - {$this->application->masterDocument->document_name}";
        } else {
            $status = $this->isApproved ? 'Disetujui' : 'Ditolak';
            $subject = "Pengajuan Surat {$status} - {$this->application->masterDocument->document_name}";
        }
        
        return new Envelope(
            subject: $subject,
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
                'isNotification' => $this->isNotification,
                'isCompleted' => $this->isCompleted,
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

