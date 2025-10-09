<?php

namespace App\Mail;

use App\Models\AssetLoan;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AssetLoanNotification extends Mailable
{
    use Queueable;
    use SerializesModels;

    public $assetLoan;
    public $isApproved;
    public $note;

    /**
     * Create a new message instance.
     */
    public function __construct(AssetLoan $assetLoan, bool $isApproved, string $note = '')
    {
        $this->assetLoan = $assetLoan;
        $this->isApproved = $isApproved;
        $this->note = $note;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $status = $this->isApproved ? 'Disetujui' : 'Ditolak';
        $subject = "Peminjaman Asset {$status} - {$this->assetLoan->asset->asset_name}";
        
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
            view: 'emails.asset_loan_notification',
            with: [
                'assetLoan' => $this->assetLoan,
                'isApproved' => $this->isApproved,
                'note' => $this->note,
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

