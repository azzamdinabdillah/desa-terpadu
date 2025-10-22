<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Event Baru - {{ $event->event_name }}</title>
</head>

<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">
                                🎉 Event Baru
                            </h1>
                            <p style="margin: 10px 0 0 0; color: #f0f0f0; font-size: 14px;">
                                Sistem Informasi Desa Terpadu
                            </p>
                        </td>
                    </tr>

                    <!-- Event Badge -->
                    <tr>
                        <td style="padding: 30px 30px 20px 30px; text-align: center;">
                            <div style="display: inline-block; background-color: #3b82f6; color: white; padding: 12px 30px; border-radius: 50px; font-size: 18px; font-weight: 600; margin-bottom: 10px;">
                                🎉 EVENT TERBARU
                            </div>
                        </td>
                    </tr>

                    <!-- Greeting -->
                    <tr>
                        <td style="padding: 20px 30px 20px 30px;">
                            <p style="margin: 0; color: #374151; font-size: 16px; line-height: 1.6;">
                                Yth. <strong>Warga Desa</strong>,
                            </p>
                            <p style="margin: 15px 0 0 0; color: #374151; font-size: 16px; line-height: 1.6;">
                                Kami mengundang Anda untuk berpartisipasi dalam event baru yang akan diselenggarakan oleh Pemerintah Desa.
                            </p>
                        </td>
                    </tr>

                    <!-- Event Details -->
                    <tr>
                        <td style="padding: 0 30px 20px 30px;">
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 8px; overflow: hidden;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
                                            Detail Event
                                        </h3>
                                        
                                        <table width="100%" cellpadding="8" cellspacing="0">
                                            <tr>
                                                <td style="color: #6b7280; font-size: 14px; width: 30%;">Nama Event</td>
                                                <td style="color: #1f2937; font-size: 16px; font-weight: 600;">{{ $event->event_name }}</td>
                                            </tr>
                                            <tr>
                                                <td style="color: #6b7280; font-size: 14px; vertical-align: top;">Tanggal Mulai</td>
                                                <td style="color: #1f2937; font-size: 14px; font-weight: 600;">{{ \Carbon\Carbon::parse($event->date_start)->locale('id')->isoFormat('D MMMM YYYY, HH:mm') }} WIB</td>
                                            </tr>
                                            <tr>
                                                <td style="color: #6b7280; font-size: 14px; vertical-align: top;">Tanggal Selesai</td>
                                                <td style="color: #1f2937; font-size: 14px; font-weight: 600;">{{ \Carbon\Carbon::parse($event->date_end)->locale('id')->isoFormat('D MMMM YYYY, HH:mm') }} WIB</td>
                                            </tr>
                                            <tr>
                                                <td style="color: #6b7280; font-size: 14px; vertical-align: top;">Lokasi</td>
                                                <td style="color: #1f2937; font-size: 14px; font-weight: 600;">{{ $event->location }}</td>
                                            </tr>
                                            <tr>
                                                <td style="color: #6b7280; font-size: 14px; vertical-align: top;">Tipe Event</td>
                                                <td style="color: #1f2937; font-size: 14px; font-weight: 600;">
                                                    @if($event->type === 'public')
                                                        🌍 Event Terbuka untuk Semua
                                                    @else
                                                        🔒 Event Terbatas
                                                    @endif
                                                </td>
                                            </tr>
                                            @if($event->max_participants)
                                            <tr>
                                                <td style="color: #6b7280; font-size: 14px; vertical-align: top;">Kuota Peserta</td>
                                                <td style="color: #1f2937; font-size: 14px; font-weight: 600;">{{ $event->max_participants }} orang</td>
                                            </tr>
                                            @endif
                                            @if($event->description)
                                            <tr>
                                                <td style="color: #6b7280; font-size: 14px; vertical-align: top;">Deskripsi</td>
                                                <td style="color: #1f2937; font-size: 14px; line-height: 1.6;">{{ $event->description }}</td>
                                            </tr>
                                            @endif
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Event Flyer -->
                    @if($event->flyer)
                    <tr>
                        <td style="padding: 0 30px 20px 30px; text-align: center;">
                            <div style="background-color: #f9fafb; border-radius: 8px; padding: 15px;">
                                <img src="{{ $appUrl }}/storage/{{ $event->flyer }}" alt="Flyer Event" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                            </div>
                        </td>
                    </tr>
                    @endif

                    <!-- Important Notice -->
                    <tr>
                        <td style="padding: 0 30px 20px 30px;">
                            <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px 20px; border-radius: 4px;">
                                <p style="margin: 0; color: #1e40af; font-size: 14px; font-weight: 600;">
                                    📅 Informasi Penting:
                                </p>
                                <p style="margin: 10px 0 0 0; color: #1d4ed8; font-size: 14px; line-height: 1.6;">
                                    @if($event->type === 'public')
                                        Event ini terbuka untuk semua warga desa. Silakan datang sesuai jadwal yang telah ditentukan.
                                    @else
                                        Event ini memiliki kuota terbatas. Segera daftar untuk memastikan tempat Anda.
                                    @endif
                                </p>
                            </div>
                        </td>
                    </tr>

                    <!-- Contact Info Section -->
                    <tr>
                        <td style="padding: 0 30px 30px 30px;">
                            <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 16px;">
                                Informasi Umum
                            </h3>
                            <ul style="margin: 0; padding-left: 20px; color: #4b5563; font-size: 14px; line-height: 1.8;">
                                <li>Untuk informasi lebih lanjut, silakan hubungi kantor desa</li>
                                <li>Jam operasional: Senin - Jumat, 08:00 - 15:00 WIB</li>
                                <li>Pastikan datang tepat waktu sesuai jadwal event</li>
                            </ul>
                        </td>
                    </tr>

                    <!-- CTA Button -->
                    <tr>
                        <td style="padding: 30px; text-align: center;">
                            <a href="{{ $appUrl }}/events" style="display: inline-block; background-color: #10b981; color: white; text-decoration: none; padding: 14px 40px; border-radius: 6px; font-size: 16px; font-weight: 600; box-shadow: 0 2px 4px rgba(16, 185, 129, 0.4);">
                                Lihat Detail Event
                            </a>
                        </td>
                    </tr>

                    <!-- Divider -->
                    <tr>
                        <td style="padding: 0 30px;">
                            <div style="border-top: 1px solid #e5e7eb;"></div>
                        </td>
                    </tr>

                    <!-- Contact Info -->
                    <tr>
                        <td style="padding: 20px 30px;">
                            <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                                <strong style="color: #374151;">Butuh bantuan?</strong><br>
                                Hubungi kami di:<br>
                                📞 Telepon: (0123) 456-7890<br>
                                📧 Email: admin@desa-terpadu.go.id<br>
                                🏢 Alamat: Jl. Raya Desa No. 123, Kecamatan, Kabupaten
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f9fafb; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0; color: #9ca3af; font-size: 12px; line-height: 1.6;">
                                Email ini dikirim secara otomatis oleh sistem.<br>
                                Mohon tidak membalas email ini.<br><br>
                                &copy; 2025 Sistem Informasi Desa Terpadu. All rights reserved.
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>

</html>
