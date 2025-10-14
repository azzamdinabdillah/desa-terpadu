<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pengajuan Surat Baru</title>
</head>

<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">
                                Sistem Informasi Desa Terpadu
                            </h1>
                            <p style="margin: 10px 0 0 0; color: #f0f0f0; font-size: 14px;">
                                Notifikasi Pengajuan Surat Baru
                            </p>
                        </td>
                    </tr>

                    <!-- Status Badge -->
                    <tr>
                        <td style="padding: 30px 30px 20px 30px; text-align: center;">
                            <div style="display: inline-block; background-color: #f59e0b; color: white; padding: 12px 30px; border-radius: 50px; font-size: 18px; font-weight: 600; margin-bottom: 10px;">
                                🔔 PENGAJUAN BARU
                            </div>
                        </td>
                    </tr>

                    <!-- Greeting -->
                    <tr>
                        <td style="padding: 20px 30px 20px 30px;">
                            <p style="margin: 0; color: #374151; font-size: 16px; line-height: 1.6;">
                                Yth. <strong>Admin Desa</strong>,
                            </p>
                            <p style="margin: 15px 0 0 0; color: #374151; font-size: 16px; line-height: 1.6;">
                                Ada pengajuan surat baru yang perlu ditinjau dan diproses. Berikut adalah detail pengajuan:
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
                                                <td style="color: #1f2937; font-size: 14px; font-weight: 600;">{{ \Carbon\Carbon::parse($application->created_at)->locale('id')->isoFormat('D MMMM YYYY, HH:mm') }} WIB</td>
                                            </tr>
                                            <tr>
                                                <td style="color: #6b7280; font-size: 14px; vertical-align: top;">Alasan Pengajuan</td>
                                                <td style="color: #1f2937; font-size: 14px;">{{ $application->reason }}</td>
                                            </tr>
                                            @if($application->citizen_note)
                                            <tr>
                                                <td style="color: #6b7280; font-size: 14px; vertical-align: top;">Catatan Tambahan</td>
                                                <td style="color: #1f2937; font-size: 14px;">{{ $application->citizen_note }}</td>
                                            </tr>
                                            @endif
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Action Required Notice -->
                    <tr>
                        <td style="padding: 0 30px 20px 30px;">
                            <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px 20px; border-radius: 4px;">
                                <p style="margin: 0; color: #92400e; font-size: 14px; font-weight: 600;">
                                    ⚠️ Tindakan Diperlukan:
                                </p>
                                <p style="margin: 10px 0 0 0; color: #b45309; font-size: 14px; line-height: 1.6;">
                                    Silakan segera tinjau dan proses pengajuan ini. Pemohon sedang menunggu konfirmasi dari admin desa.
                                </p>
                            </div>
                        </td>
                    </tr>

                    <!-- Information Section -->
                    <tr>
                        <td style="padding: 0 30px 30px 30px;">
                            <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 16px;">
                                Langkah Selanjutnya
                            </h3>
                            <ul style="margin: 0; padding-left: 20px; color: #4b5563; font-size: 14px; line-height: 1.8;">
                                <li>Login ke sistem untuk melihat detail lengkap pengajuan</li>
                                <li>Verifikasi data pemohon dan kelengkapan dokumen</li>
                                <li>Setujui atau tolak pengajuan dengan memberikan catatan</li>
                                <li>Pemohon akan mendapat notifikasi email setelah Anda memproses pengajuan</li>
                            </ul>
                        </td>
                    </tr>

                    <!-- CTA Button -->
                    <tr>
                        <td style="padding: 30px; text-align: center;">
                            <a href="{{ config('app.url') }}/document-applications" style="display: inline-block; background-color: #3b82f6; color: white; text-decoration: none; padding: 14px 40px; border-radius: 6px; font-size: 16px; font-weight: 600; box-shadow: 0 2px 4px rgba(59, 130, 246, 0.4);">
                                Buka Sistem & Proses Pengajuan
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
                                <strong style="color: #374151;">Informasi Kontak Sistem</strong><br>
                                📧 Email: admin@desa-terpadu.go.id<br>
                                📞 Support: (0123) 456-7890<br>
                                🏢 Kantor Desa: Senin - Jumat, 08:00 - 15:00 WIB
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

