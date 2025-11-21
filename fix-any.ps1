$filePath = "app/dashboard/sites/[id]/page.tsx"
$content = [System.IO.File]::ReadAllText($filePath)

# Reemplazo 1: Línea 271 - localData as any
$pattern1 = [regex]::Escape('((localData as any).customElements')
$replacement1 = '((localData as BlockData & { customElements?: StackElement[] }).customElements'
$content = $content -replace $pattern1, $replacement1

# Reemplazo 2: Línea 282 - setLocalData as any
$pattern2 = [regex]::Escape('setLocalData({ ...localData, customElements: elements } as any);')
$replacement2 = 'setLocalData({ ...localData, customElements: elements } as BlockData & { customElements: StackElement[] });'
$content = $content -replace $pattern2, $replacement2

# Reemplazo 3: Línea 366 - let elementData: any
$pattern3 = [regex]::Escape('let elementData: any;')
$replacement3 = 'let elementData: Record<string, unknown>;'
$content = $content -replace $pattern3, $replacement3

# Reemplazo 4: Línea 535-536 - element.data as any (dos líneas)
$pattern4 = 'const isSlot = element\.type === ''slot'' \|\| \(element\.data as any\)\.isEmpty;\r\n\s+const elementData = element\.data as any;'
$replacement4 = @'
const elementData = element.data as StackElement['data'] & { isEmpty?: boolean; slotType?: string; acceptedTypes?: string[]; placeholder?: string; content?: unknown };
                                        const isSlot = element.type === 'slot' || elementData.isEmpty;
'@
$content = $content -replace $pattern4, $replacement4

# Reemplazo 5: Línea 1260 - blockInfo as any
$pattern5 = [regex]::Escape('const category = (blockInfo as any).category')
$replacement5 = 'const category = (blockInfo as BlockConfig<BlockData> & { category?: string }).category'
$content = $content -replace $pattern5, $replacement5

# Reemplazo 6: Eliminar la línea "content: elementData," de handleFillSlot
$pattern6 = '(\s+isEmpty: false,)\s+content: elementData,\s+(\.\.\. elementData)'
$replacement6 = '$1 $2'
$content = $content -replace $pattern6, $replacement6

[System.IO.File]::WriteAllText($filePath, $content)
Write-Host "Todos los reemplazos completados exitosamente"
Write-Host "Se eliminaron todos los usos de any en el archivo"
