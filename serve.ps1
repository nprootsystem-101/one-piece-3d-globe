# Simple HTTP Server for local development
$port = 3000
$root = $PSScriptRoot

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Host "Server running at http://localhost:$port"
Write-Host "Serving files from: $root"
Write-Host "Press Ctrl+C to stop"

$mimeTypes = @{
    '.html' = 'text/html'
    '.css'  = 'text/css'
    '.js'   = 'application/javascript'
    '.json' = 'application/json'
    '.png'  = 'image/png'
    '.jpg'  = 'image/jpeg'
    '.svg'  = 'image/svg+xml'
    '.ico'  = 'image/x-icon'
    '.woff2'= 'font/woff2'
    '.woff' = 'font/woff'
}

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $localPath = $request.Url.LocalPath
        if ($localPath -eq '/') { $localPath = '/index.html' }

        $filePath = Join-Path $root ($localPath.TrimStart('/').Replace('/', '\'))

        if (Test-Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath)
            $contentType = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { 'application/octet-stream' }

            $response.ContentType = "$contentType; charset=utf-8"
            $response.Headers.Add('Access-Control-Allow-Origin', '*')
            $response.StatusCode = 200

            $fileBytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentLength64 = $fileBytes.Length
            $response.OutputStream.Write($fileBytes, 0, $fileBytes.Length)
            Write-Host "200 $localPath"
        } else {
            $response.StatusCode = 404
            $msg = [System.Text.Encoding]::UTF8.GetBytes('404 Not Found')
            $response.OutputStream.Write($msg, 0, $msg.Length)
            Write-Host "404 $localPath"
        }
        $response.Close()
    }
} finally {
    $listener.Stop()
}
