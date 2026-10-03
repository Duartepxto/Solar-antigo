# Organization branding

An organization administrator can upload a logo in Admin → Branding. Use PNG,
JPEG or WebP, up to 5 MB per upload. Admin resizes the image before saving; the
normalized branding payload is limited to 128 KiB.

Members connect through Settings → Organisation as usual. The logo appears
in the sidebar and Organization settings. Bots keep their own colour and
mascot; the app has no custom bot portraits, so any shared icons an Admin
still sends are not shown.

Connected desktop apps refresh branding on the existing session heartbeat.
Use Refresh in Organization settings to fetch changes immediately. Older
Admins return no branding, so the standard app appearance remains unchanged.
Personal users do not need to sign in.

Disconnecting hides the organization logo.
Branding does not change the installed application name, Dock/Start-menu icon,
model permissions, or authentication. Remote workspace pages cannot read the
local desktop's organization branding.
