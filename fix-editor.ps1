$filePath = "app/dashboard/sites/[id]/page.tsx"
$content = [System.IO.File]::ReadAllText($filePath)

# 1. Añadir el import si no existe
$importLine = "import { AdvancedEditorImproved } from '@/app/components/editor/AdvancedEditorImproved';"
if ($content -notmatch "AdvancedEditorImproved") {
    $content = $content -replace "import { StackElement, StackElementType } from '@/app/components/editor/blocks/CustomStackElements';", "import { StackElement, StackElementType } from '@/app/components/editor/blocks/CustomStackElements';`n$importLine"
}

# 2. Reemplazar el componente
# Buscamos la etiqueta de apertura y la reemplazamos
$content = $content -replace "<AdvancedEditorCanvas", "<AdvancedEditorImproved"

[System.IO.File]::WriteAllText($filePath, $content)
Write-Host "✅ Import añadido y componente reemplazado correctamente."
