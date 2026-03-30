$port = 8080
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Host "Servidor rodando em http://localhost:$port/"
Write-Host "Pressione Ctrl+C para parar."

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $requestUrl = $request.Url.LocalPath
        if ($requestUrl -eq "/") { $requestUrl = "/index.html" }
        
        # Security: Prevent directory traversal
        $safeUrl = $requestUrl.Replace("..", "")
        # Convert web path to local path properly, removing leading slash
        $localRelativePath = $safeUrl.TrimStart("/")
        $filePath = Join-Path (Get-Location).Path $localRelativePath
        
        if (Test-Path -Path $filePath -PathType Leaf) {
            try {
                $buffer = [System.IO.File]::ReadAllBytes($filePath)
                $response.ContentLength64 = $buffer.Length
                
                # Basic MIME types
                if ($filePath -match "\.css$") { $response.ContentType = "text/css" }
                elseif ($filePath -match "\.js$") { $response.ContentType = "application/javascript" }
                elseif ($filePath -match "\.png$") { $response.ContentType = "image/png" }
                elseif ($filePath -match "\.jpg$" -or $filePath -match "\.jpeg$") { $response.ContentType = "image/jpeg" }
                elseif ($filePath -match "\.svg$") { $response.ContentType = "image/svg+xml" }
                else { $response.ContentType = "text/html" }
                
                $response.OutputStream.Write($buffer, 0, $buffer.Length)
            } catch {
                $response.StatusCode = 500
                $msg = [System.Text.Encoding]::UTF8.GetBytes("Erro Interno do Servidor")
                $response.ContentLength64 = $msg.Length
                $response.OutputStream.Write($msg, 0, $msg.Length)
            }
        } else {
            $response.StatusCode = 404
            $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Nao Encontrado: " + $filePath)
            $response.ContentLength64 = $msg.Length
            $response.OutputStream.Write($msg, 0, $msg.Length)
        }
        $response.Close()
    }
} finally {
    $listener.Stop()
    $listener.Close()
}
