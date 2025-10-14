<?php

namespace App\Mail;

use App\Models\AssetLoan;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewAssetLoanNotification extends Mailable
{
    use Queueable;
    use SerializesModels;

    public $assetLoan;

    /**
     * Create a new message instance.
     */
    public function __construct(AssetLoan $assetLoan)
    {
        $this->assetLoan = $assetLoan;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Pengajuan Peminjaman Asset Baru - {$this->assetLoan->asset->asset_name}",
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.new_asset_loan_admin',
            with: [
                'assetLoan' => $this->assetLoan,
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

