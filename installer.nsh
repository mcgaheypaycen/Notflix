!macro customHeader
  !system "echo '' > ${BUILD_RESOURCES_DIR}/customHeader"
!macroend

!macro customInit
  ; Set compression
  SetCompressor /SOLID lzma
  SetCompressorDictSize 64
  
  ; Modern UI
  !include "MUI2.nsh"
  !define MUI_ABORTWARNING
  !define MUI_ICON "build\icons\icon.ico"
  !define MUI_UNICON "build\icons\icon.ico"
  
  ; Pages
  !insertmacro MUI_PAGE_WELCOME
  !insertmacro MUI_PAGE_LICENSE "LICENSE"
  !insertmacro MUI_PAGE_DIRECTORY
  !insertmacro MUI_PAGE_INSTFILES
  !insertmacro MUI_PAGE_FINISH
  
  ; Uninstaller pages
  !insertmacro MUI_UNPAGE_CONFIRM
  !insertmacro MUI_UNPAGE_INSTFILES
  
  ; Language
  !insertmacro MUI_LANGUAGE "English"
!macroend

!macro customInstall
  ; Create registry entries
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\Notflix" "DisplayName" "Notflix"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\Notflix" "UninstallString" "$\"$INSTDIR\Uninstall.exe$\""
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\Notflix" "DisplayIcon" "$INSTDIR\Notflix.exe"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\Notflix" "Publisher" "Notflix Media Player"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\Notflix" "DisplayVersion" "${VERSION}"
  WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\Notflix" "NoModify" 1
  WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\Notflix" "NoRepair" 1
  
  ; Create file associations for video files
  WriteRegStr HKCR ".mp4" "" "Notflix.Video"
  WriteRegStr HKCR "Notflix.Video" "" "Notflix Video File"
  WriteRegStr HKCR "Notflix.Video\DefaultIcon" "" "$INSTDIR\Notflix.exe,0"
  WriteRegStr HKCR "Notflix.Video\shell\open\command" "" "$\"$INSTDIR\Notflix.exe$\" $\"%1$\""
  
  ; Add to PATH (optional)
  ; EnVar::SetHKLM
  ; EnVar::AddValue "Path" "$INSTDIR"
!macroend

!macro customUnInstall
  ; Remove registry entries
  DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\Notflix"
  DeleteRegKey HKCR ".mp4"
  DeleteRegKey HKCR "Notflix.Video"
  
  ; Remove from PATH (optional)
  ; EnVar::SetHKLM
  ; EnVar::DeleteValue "Path" "$INSTDIR"
  
  ; Remove app data
  RMDir /r "$APPDATA\Notflix"
  RMDir /r "$LOCALAPPDATA\Notflix"
!macroend 