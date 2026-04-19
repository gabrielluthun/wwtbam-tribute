$ErrorActionPreference = 'Stop'

# Dossier source = frontend/src/asset, cible = frontend/src/asset/sounds
$src = Join-Path $PSScriptRoot '..\src\asset'
$dst = Join-Path $src 'sounds'

if (-not (Test-Path $dst)) {
    New-Item -ItemType Directory -Path $dst | Out-Null
}

# Map: prefixe numerique (tel qu'il apparait au debut du nom) => nouveau nom
$map = @{
    '03 '     = 'intro_rules.mp3'
    '10 '     = 'game_start.mp3'
    '11 '     = 'q_tier1.mp3'
    '11. '    = 'win_tier1.mp3'
    '11.5 '   = 'lose_tier1.mp3'
    '12 '     = 'checkpoint_1k_win.mp3'

    '13 '     = 'lets_play_L06.mp3'
    '14 '     = 'q_L06.mp3'
    '15 '     = 'final_L06.mp3'
    '16 '     = 'lose_L06.mp3'
    '17 '     = 'win_L06.mp3'

    '18 '     = 'lets_play_L07.mp3'
    '19 '     = 'q_L07.mp3'
    '20 '     = 'final_L07.mp3'
    '21 '     = 'lose_L07.mp3'
    '22 '     = 'win_L07.mp3'

    '23 '     = 'lets_play_L08.mp3'
    '24 '     = 'q_L08.mp3'
    '25 '     = 'final_L08.mp3'
    '26 '     = 'lose_L08.mp3'
    '27 '     = 'win_L08.mp3'

    '28 '     = 'lets_play_L09.mp3'
    '29 '     = 'q_L09.mp3'
    '30 '     = 'final_L09.mp3'
    '31 '     = 'lose_L09.mp3'
    '32 '     = 'win_L09.mp3'

    '33 '     = 'lets_play_L10.mp3'
    '34. '    = 'q_L10.mp3'
    '35 '     = 'final_L10.mp3'
    '36 '     = 'lose_L10.mp3'
    '37 '     = 'win_L10.mp3'

    '38 '     = 'lets_play_L11.mp3'
    '39 '     = 'q_L11.mp3'
    '40 '     = 'final_L11.mp3'
    '41 '     = 'lose_L11.mp3'
    '42 '     = 'win_L11.mp3'

    '43 '     = 'lets_play_L12.mp3'
    '44 '     = 'q_L12.mp3'
    '45 '     = 'final_L12.mp3'
    '46 '     = 'lose_L12.mp3'
    '47 '     = 'win_L12.mp3'

    '48 '     = 'lets_play_L13.mp3'
    '49. '    = 'q_L13.mp3'
    '50 '     = 'final_L13.mp3'
    '51 '     = 'lose_L13.mp3'
    '52 '     = 'win_L13.mp3'

    '53 '     = 'lets_play_L14.mp3'
    '54 '     = 'q_L14.mp3'
    '55 '     = 'final_L14.mp3'
    '56 '     = 'lose_L14.mp3'
    '57 '     = 'win_L14.mp3'

    '58 '     = 'lets_play_L15.mp3'
    '59 '     = 'q_L15.mp3'
    '60 '     = 'final_L15.mp3'
    '61 '     = 'lose_L15.mp3'
    '62 '     = 'win_L15.mp3'

    '65 '     = 'lifeline_ping.mp3'
    '66 '     = 'phone_friend.mp3'
    '67 '     = 'fifty_fifty.mp3'
    '68 '     = 'ask_audience.mp3'
    '71 '     = 'time_up.mp3'
    '72 '     = 'goodbye.mp3'
}

# On trie les prefixes par longueur descendante pour que '11.5 ' soit teste avant '11. ' avant '11 '
$prefixes = $map.Keys | Sort-Object -Property Length -Descending

$files = Get-ChildItem -Path $src -Filter *.mp3 -File
foreach ($file in $files) {
    $name = $file.Name
    $matched = $false
    foreach ($p in $prefixes) {
        if ($name.StartsWith($p)) {
            $newName = $map[$p]
            $target = Join-Path $dst $newName
            Move-Item -LiteralPath $file.FullName -Destination $target -Force
            Write-Host "Renamed: $name -> $newName"
            $matched = $true
            break
        }
    }
    if (-not $matched) {
        Write-Host "Skipped (no mapping): $name" -ForegroundColor Yellow
    }
}

# On supprime aussi le fichier 05 s'il est encore la (non utilise)
$unused = Get-ChildItem -Path $src -Filter *.mp3 -File
foreach ($u in $unused) {
    Write-Host "Leftover unmapped file kept at root: $($u.Name)" -ForegroundColor Yellow
}

Write-Host "Done."
