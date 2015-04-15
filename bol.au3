#include <Array.au3>
#include <Crypt.au3>

TCPStartUp()

$iPort = 8001

$hListenSocket = TCPListen("127.0.0.1", $iPort)
If $hListenSocket = -1 Then Exit

While 1
    $hConnectSocket = TCPAccept($hListenSocket)
    If $hConnectSocket <> -1 Then ExitLoop
Wend
Sleep(100)

$sUpgradeRequest = TCPRecv($hConnectSocket, 2048)
ConsoleWrite("+Recv:" & @CrLf & $sUpgradeRequest & @Crlf)

$response = HandshakeHYBI00($sUpgradeRequest)

If IsArray($response) Then
    ;handshake succeeded, open connection
    $sUpgradeResponse = _ArrayToString($response, @CrLf)
    TCPSend($hConnectSocket, $sUpgradeResponse)

    ConsoleWrite(@CrLf & "+Send:" & @CrLf & $sUpgradeResponse & @CrLf)
EndIf

TCPSend($hConnectSocket, "Hello !")

While 1

WEnd

Func HandshakeHYBI00($request)
    ; split up lines and parse
    Local $lines = StringSplit($request, @Cr)

    If StringInStr($lines[6], 'Sec-WebSocket-Key1') And StringInStr($lines[7], 'Sec-WebSocket-Key2') Then
        Local $aKey1Data = StringSplit($lines[6], ": ", 1), $aKey2Data = StringSplit($lines[7], ": ", 1)
        Local $key1 = computeKey($aKey1Data[2]), $key2 = computeKey($aKey2Data[2])
        Local $OriginData = StringSplit($lines[5], ": ", 1)
        Local $data = StringRight($request, 8) ;md5 hash

        ;update hash with all values
        _Crypt_Startup()
        $hash = _Crypt_HashData(bigEndian($key1) & bigEndian($key2) & $data, $CALG_MD5)
        _Crypt_Shutdown()

        Local $response[7] = [ _
            'HTTP/1.1 101 WebSocket Protocol Handshake', _
            'Upgrade: WebSocket', _
            'Connection: Upgrade', _
            'Sec-WebSocket-Origin: ' & $OriginData[2], _
            'Sec-WebSocket-Location: ws://localhost:' & $iPort, _
            '', _
            BinaryToString($hash) _
        ]

        Return $response
    EndIf

    Return false
EndFunc

Func bigEndian($value)
    Local $result[4] = [ _
        Chr(BitShift($value, 24 & 0xFF)), _
        Chr(BitShift($value, 16 & 0xFF)), _
        Chr(BitShift($value, 8 & 0xFF)), _
        Chr($value & 0xFF) _
    ]
    Return _ArrayToString($result, "")
EndFunc

Func computeKey($key)
    Local $spaces, $number
    $spaces = StringSplit($key, " ")
    $number = Int(StringRegExpReplace($key, "\D", ""))

    Return ($number / $spaces[0])
EndFunc