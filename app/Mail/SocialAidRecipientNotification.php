<?php

namespace App\Mail;

use App\Models\SocialAidRecipient;
use App\Models\SocialAidProgram;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SocialAidRecipientNotification extends Mailable
{
    use Queueable;
    use SerializesModels;

    public $program;
    public $recipient;
    public $recipientName;
    public $recipientIdentifier;

    /**
     * Create a new message instance.
     */
    public function __construct(SocialAidProgram $program, SocialAidRecipient $recipient)
    {
        $this->program = $program;
        $this->recipient = $recipient;

        // Set recipient name and identifier based on type
        if ($recipient->citizen_id) {
            $this->recipientName = $recipient->citizen->full_name ?? 'Penerima';
            $this->recipientIdentifier = 'NIK: ' . ($recipient->citizen->nik ?? '-');
        } else {
            $this->recipientName = $recipient->family->family_name ?? 'Keluarga Penerima';
            $this->recipientIdentifier = 'No. KK: ' . ($recipient->family->kk_number ?? '-');
        }
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Pendaftaran Penerima Bantuan Sosial - {$this->program->program_name}",
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.social_aid_recipient_notification',
            with: [
                'program' => $this->program,
                'recipient' => $this->recipient,
                'recipientName' => $this->recipientName,
                'recipientIdentifier' => $this->recipientIdentifier,
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

