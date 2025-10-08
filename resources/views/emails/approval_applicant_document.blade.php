<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Status Pengajuan Surat</title>
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
                                Notifikasi Status Pengajuan Surat
                            </p>
                        </td>
                    </tr>

                    <!-- Status Badge -->
                    @if(!isset($isNotification) || !$isNotification)
                    <tr>
                        <td style="padding: 30px 30px 20px 30px; text-align: center;">
                            @if(isset($isCompleted) && $isCompleted)
                            <div style="display: inline-block; background-color: #3b82f6; color: white; padding: 12px 30px; border-radius: 50px; font-size: 18px; font-weight: 600; margin-bottom: 10px;">
                                ✓ PENGAJUAN SELESAI
                            </div>
                            @elseif($isApproved)
                            <div style="display: inline-block; background-color: #10b981; color: white; padding: 12px 30px; border-radius: 50px; font-size: 18px; font-weight: 600; margin-bottom: 10px;">
                                ✓ PENGAJUAN DISETUJUI
                            </div>
                            @else
                            <div style="display: inline-block; background-color: #ef4444; color: white; padding: 12px 30px; border-radius: 50px; font-size: 18px; font-weight: 600; margin-bottom: 10px;">
                                ✗ PENGAJUAN DITOLAK
                            </div>
                            @endif
                        </td>
                    </tr>
                    @endif

                    <!-- Greeting -->
                    <tr>
                        <td style="padding: {{ (!isset($isNotification) || !$isNotification) ? '0' : '30px' }} 30px 20px 30px;">
                            <p style="margin: 0; color: #374151; font-size: 16px; line-height: 1.6;">
                                Yth. <strong>{{ $application->citizen->full_name ?? 'Pemohon' }}</strong>,
                            </p>
                            <p style="margin: 15px 0 0 0; color: #374151; font-size: 16px; line-height: 1.6;">
                                @if(isset($isCompleted) && $isCompleted)
                                Selamat! Pengajuan surat Anda telah selesai diproses. Berikut adalah detail pengajuan Anda:
                                @elseif(isset($isNotification) && $isNotification)
                                Berikut adalah informasi terkait pengajuan surat Anda:
                                @else
                                Pengajuan surat Anda telah diproses oleh admin desa. Berikut adalah detail pengajuan Anda:
                                @endif
                            </p>
                        </td>
                    </tr>

                    <!-- Application Details -->
                    <tr>
                        <td style="padding: 0 30px 20px 30px;">
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 8px; overflow: hidden;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
                                            Detail Pengajuan
                                        </h3>
                                        
                                        <table width="100%" cellpadding="8" cellspacing="0">
                                            <tr>
                                                <td style="color: #6b7280; font-size: 14px; width: 40%;">Nomor Pengajuan</td>
                                                <td style="color: #1f2937; font-size: 14px; font-weight: 600;">#APP-{{ str_pad($application->id, 6, '0', STR_PAD_LEFT) }}</td>
                                            </tr>
                                            <tr>
                                                <td style="color: #6b7280; font-size: 14px;">Jenis Surat</td>
                                                <td style="color: #1f2937; font-size: 14px; font-weight: 600;">{{ $application->masterDocument->document_name ?? 'N/A' }}</td>
                                            </tr>
                                            <tr>
                                                <td style="color: #6b7280; font-size: 14px;">NIK Pemohon</td>
                                                <td style="color: #1f2937; font-size: 14px; font-weight: 600;">{{ $application->nik }}</td>
                                            </tr>
                                            <tr>
                                                <td style="color: #6b7280; font-size: 14px;">Nama Pemohon</td>
                                                <td style="color: #1f2937; font-size: 14px; font-weight: 600;">{{ $application->citizen->full_name ?? 'N/A' }}</td>
                                            </tr>
                                            <tr>
                                                <td style="color: #6b7280; font-size: 14px;">Tanggal Pengajuan</td>
                                                <td style="color: #1f2937; font-size: 14px; font-weight: 600;">{{ \Carbon\Carbon::parse($application->created_at)->locale('id')->isoFormat('D MMMM YYYY') }}</td>
                                            </tr>
                                            <tr>
                                                <td style="color: #6b7280; font-size: 14px; vertical-align: top;">Alasan Pengajuan</td>
                                                <td style="color: #1f2937; font-size: 14px;">{{ $application->reason }}</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Admin Note -->
                    <tr>
                        <td style="padding: 0 30px 20px 30px;">
                            @if(isset($isCompleted) && $isCompleted)
                            <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px 20px; border-radius: 4px;">
                                <p style="margin: 0; color: #1e40af; font-size: 14px; font-weight: 600;">
                                    ✅ Catatan Penyelesaian:
                                </p>
                                <p style="margin: 10px 0 0 0; color: #1d4ed8; font-size: 14px; line-height: 1.6;">
                                    {{ $adminNote }}
                                </p>
                            </div>
                            @elseif(isset($isNotification) && $isNotification)
                            <div style="background-color: #ecfdf5; border-left: 4px solid #10b981; padding: 15px 20px; border-radius: 4px;">
                                <p style="margin: 0; color: #065f46; font-size: 14px; font-weight: 600;">
                                    📝 Informasi dari Admin:
                                </p>
                                <p style="margin: 10px 0 0 0; color: #047857; font-size: 14px; line-height: 1.6;">
                                    {{ $adminNote }}
                                </p>
                            </div>
                            @else
                                @if($isApproved)
                                <div style="background-color: #ecfdf5; border-left: 4px solid #10b981; padding: 15px 20px; border-radius: 4px;">
                                    <p style="margin: 0; color: #065f46; font-size: 14px; font-weight: 600;">
                                        📝 Catatan Admin:
                                    </p>
                                    <p style="margin: 10px 0 0 0; color: #047857; font-size: 14px; line-height: 1.6;">
                                        {{ $adminNote }}
                                    </p>
                                </div>
                                @else
                                <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 15px 20px; border-radius: 4px;">
                                    <p style="margin: 0; color: #991b1b; font-size: 14px; font-weight: 600;">
                                        ❌ Alasan Penolakan:
                                    </p>
                                    <p style="margin: 10px 0 0 0; color: #b91c1c; font-size: 14px; line-height: 1.6;">
                                        {{ $adminNote }}
                                    </p>
                                </div>
                                @endif
                            @endif
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
                                <li>Pastikan membawa dokumen identitas (KTP) saat berkunjung</li>
                            </ul>
                        </td>
                    </tr>

                    <!-- CTA Button -->
                    <tr>
                        <td style="padding: {{ (isset($isNotification) && $isNotification) ? '20px' : '0' }} 30px 30px 30px; text-align: center;">
                            <a href="#" style="display: inline-block; background-color: #10b981; color: white; text-decoration: none; padding: 14px 40px; border-radius: 6px; font-size: 16px; font-weight: 600; box-shadow: 0 2px 4px rgba(16, 185, 129, 0.4);">
                                Lihat Detail Pengajuan
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

