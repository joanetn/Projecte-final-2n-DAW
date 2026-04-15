<!doctype html>
<html lang="es">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $subjectLine }}</title>
</head>
@php
$urgency = strtoupper((string) ($urgencia ?? 'NORMAL'));
@endphp

<body style="margin:0;padding:0;background:#f8fafc;font-family:Segoe UI,Arial,sans-serif;color:#0f172a;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f8fafc;padding:24px 12px;">
        <tr>
            <td align="center">
                <table role="presentation" width="640" cellspacing="0" cellpadding="0" style="max-width:640px;width:100%;background:#ffffff;border:1px solid #e2e8f0;border-radius:14px;overflow:hidden;">
                    <tr>
                        <td style="background:linear-gradient(135deg,#ea580c,#d97706);padding:20px 24px;">
                            <div style="font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#ffedd5;font-weight:600;">PadelPlay</div>
                            <div style="margin-top:6px;font-size:22px;line-height:1.25;font-weight:700;color:#ffffff;">{{ $subjectLine }}</div>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:20px 24px 8px 24px;">
                            @if ($urgency === 'CRITICA')
                            <span style="display:inline-block;padding:6px 10px;border-radius:999px;background:#FEE2E2;color:#991B1B;border:1px solid #F87171;font-size:12px;font-weight:700;letter-spacing:.02em;">
                                Urgencia: {{ $urgency }}
                            </span>
                            @elseif ($urgency === 'ALTA')
                            <span style="display:inline-block;padding:6px 10px;border-radius:999px;background:#FEF3C7;color:#92400E;border:1px solid #F59E0B;font-size:12px;font-weight:700;letter-spacing:.02em;">
                                Urgencia: {{ $urgency }}
                            </span>
                            @elseif ($urgency === 'BAJA')
                            <span style="display:inline-block;padding:6px 10px;border-radius:999px;background:#D1FAE5;color:#065F46;border:1px solid #34D399;font-size:12px;font-weight:700;letter-spacing:.02em;">
                                Urgencia: {{ $urgency }}
                            </span>
                            @else
                            <span style="display:inline-block;padding:6px 10px;border-radius:999px;background:#DBEAFE;color:#1E40AF;border:1px solid #60A5FA;font-size:12px;font-weight:700;letter-spacing:.02em;">
                                Urgencia: {{ $urgency }}
                            </span>
                            @endif
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:10px 24px 0 24px;">
                            <div style="font-size:13px;color:#64748b;text-transform:uppercase;letter-spacing:.06em;font-weight:700;">Suceso</div>
                            <div style="margin-top:8px;font-size:16px;line-height:1.5;color:#0f172a;font-weight:600;">
                                {{ $suceso }}
                            </div>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:16px 24px 24px 24px;">
                            <div style="border:1px solid #e2e8f0;border-radius:10px;background:#ffffff;padding:16px;">
                                <div style="font-size:13px;color:#64748b;text-transform:uppercase;letter-spacing:.06em;font-weight:700;">Mensaje</div>
                                <div style="margin-top:10px;font-size:15px;line-height:1.6;color:#0f172a;">
                                    {!! $messageHtml !!}
                                </div>
                            </div>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:12px 24px 22px 24px;border-top:1px solid #e2e8f0;background:#f8fafc;">
                            <div style="font-size:12px;color:#64748b;">
                                Generado: {{ \Carbon\Carbon::parse($generatedAt)->timezone('Europe/Madrid')->format('d/m/Y H:i') }} (Europe/Madrid)
                            </div>
                            <div style="margin-top:6px;font-size:12px;color:#94a3b8;">
                                Este correo se ha enviado automáticamente desde el módulo de notificaciones de PadelPlay.
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>