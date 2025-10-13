<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Notifikasi Penerima Bantuan Sosial</title>
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
                                Sistem Informasi Desa Terpadu
                            </h1>
                            <p style="margin: 10px 0 0 0; color: #f0f0f0; font-size: 14px;">
                                Notifikasi Penerima Bantuan Sosial
                            </p>
                        </td>
                    </tr>

                    <!-- Status Badge -->
                    <tr>
                        <td style="padding: 30px 30px 20px 30px; text-align: center;">
                            <div style="display: inline-block; background-color: #10b981; color: white; padding: 12px 30px; border-radius: 50px; font-size: 18px; font-weight: 600; margin-bottom: 10px;">
                                ✓ TERDAFTAR SEBAGAI PENERIMA
                            </div>
                        </td>
                    </tr>

                    <!-- Greeting -->
                    <tr>
                        <td style="padding: 20px 30px 20px 30px;">
                            <p style="margin: 0; color: #374151; font-size: 16px; line-height: 1.6;">
                                Yth. <strong>{{ $recipientName }}</strong>,
                            </p>
                            <p style="margin: 15px 0 0 0; color: #374151; font-size: 16px; line-height: 1.6;">
                                Selamat! Anda telah terdaftar sebagai penerima bantuan sosial. Berikut adalah detail program bantuan yang Anda terima:
                            </p>
                        </td>
                    </tr>

                    <!-- Program Details -->
                    <tr>
                        <td style="padding: 0 30px 20px 30px;">
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 8px; overflow: hidden;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
                                            Detail Program Bantuan
                                        </h3>
                                        
                                        <table width="100%" cellpadding="8" cellspacing="0">
                                            <tr>
                                                <td style="color: #6b7280; font-size: 14px; width: 40%;">Nama Program</td>
                                                <td style="color: #1f2937; font-size: 14px; font-weight: 600;">{{ $program->program_name }}</td>
                                            </tr>
                                            <tr>
                                                <td style="color: #6b7280; font-size: 14px;">Periode</td>
                                                <td style="color: #1f2937; font-size: 14px; font-weight: 600;">{{ $program->period }}</td>
                                            </tr>
                                            <tr>
                                                <td style="color: #6b7280; font-size: 14px;">Jenis Program</td>
                                                <td style="color: #1f2937; font-size: 14px; font-weight: 600;">
                                                    @if($program->type === 'individual')
                                                        Individu
                                                    @elseif($program->type === 'household')
                                                        Keluarga
                                                    @else
                                                        Umum
                                                    @endif
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="color: #6b7280; font-size: 14px;">Tanggal Mulai</td>
                                                <td style="color: #1f2937; font-size: 14px; font-weight: 600;">{{ \Carbon\Carbon::parse($program->date_start)->locale('id')->isoFormat('D MMMM YYYY') }}</td>
                                            </tr>
                                            <tr>
                                                <td style="color: #6b7280; font-size: 14px;">Tanggal Selesai</td>
                                                <td style="color: #1f2937; font-size: 14px; font-weight: 600;">{{ \Carbon\Carbon::parse($program->date_end)->locale('id')->isoFormat('D MMMM YYYY') }}</td>
                                            </tr>
                                            @if($program->location)
                                            <tr>
                                                <td style="color: #6b7280; font-size: 14px;">Lokasi Pengambilan</td>
                                                <td style="color: #1f2937; font-size: 14px; font-weight: 600;">{{ $program->location }}</td>
                                            </tr>
                                            @endif
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Recipient Details -->
                    <tr>
                        <td style="padding: 0 30px 20px 30px;">
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ecfdf5; border-radius: 8px; overflow: hidden;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 18px; border-bottom: 2px solid #d1fae5; padding-bottom: 10px;">
                                            Data Penerima
                                        </h3>
                                        
                                        <table width="100%" cellpadding="8" cellspacing="0">
                                            <tr>
                                                <td style="color: #065f46; font-size: 14px; width: 40%;">Nama Penerima</td>
                                                <td style="color: #047857; font-size: 14px; font-weight: 600;">{{ $recipientName }}</td>
                                            </tr>
                                            <tr>
                                                <td style="color: #065f46; font-size: 14px;">Identitas</td>
                                                <td style="color: #047857; font-size: 14px; font-weight: 600;">{{ $recipientIdentifier }}</td>
                                            </tr>
                                            <tr>
                                                <td style="color: #065f46; font-size: 14px;">Status</td>
                                                <td>
                                                    <span style="display: inline-block; background-color: #fef3c7; color: #92400e; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;">
                                                        {{ $recipient->status === 'not_collected' ? 'Belum Diambil' : 'Sudah Diambil' }}
                                                    </span>
                                                </td>
                                            </tr>
                                            @if($recipient->note)
                                            <tr>
                                                <td style="color: #065f46; font-size: 14px; vertical-align: top;">Catatan</td>
                                                <td style="color: #047857; font-size: 14px;">{{ $recipient->note }}</td>
                                            </tr>
                                            @endif
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Program Description -->
                    @if($program->description)
                    <tr>
                        <td style="padding: 0 30px 20px 30px;">
                            <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px 20px; border-radius: 4px;">
                                <p style="margin: 0; color: #1e40af; font-size: 14px; font-weight: 600;">
                                    📋 Deskripsi Program:
                                </p>
                                <p style="margin: 10px 0 0 0; color: #1d4ed8; font-size: 14px; line-height: 1.6;">
                                    {{ $program->description }}
                                </p>
                            </div>
                        </td>
                    </tr>
                    @endif

                    <!-- Important Information -->
                    <tr>
                        <td style="padding: 0 30px 30px 30px;">
                            <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 16px;">
                                Informasi Penting
                            </h3>
                            <ul style="margin: 0; padding-left: 20px; color: #4b5563; font-size: 14px; line-height: 1.8;">
                                <li>Silakan datang ke lokasi yang telah ditentukan pada jadwal yang ditentukan</li>
                                <li>Pastikan membawa dokumen identitas (KTP/KK) asli saat pengambilan bantuan</li>
                                <li>Bantuan hanya dapat diambil oleh penerima yang terdaftar atau keluarga terdekat dengan surat kuasa</li>
                                <li>Untuk informasi lebih lanjut, silakan hubungi kantor desa</li>
                            </ul>
                        </td>
                    </tr>

                    <!-- CTA Button -->
                    <tr>
                        <td style="padding: 30px; text-align: center; background-color: #f9fafb;">
                            <a href="#" style="display: inline-block; background-color: #10b981; color: white; text-decoration: none; padding: 14px 40px; border-radius: 6px; font-size: 16px; font-weight: 600; box-shadow: 0 2px 4px rgba(16, 185, 129, 0.4);">
                                Lihat Detail Program
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

