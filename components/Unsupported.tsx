import type { CSSProperties } from 'react'
import { Callout, CalloutKind } from './Callouts'
import { UAParser } from 'ua-parser-js'
import { useEffect, useState, ReactNode } from 'react'

const boldA: CSSProperties = { fontWeight: 'bold' }
const code: CSSProperties = { fontFamily: 'monospace', background: 'rgba(128,128,128,0.15)', padding: '1px 4px', borderRadius: 3 }

export default function Unsupported() {
    const [detail, setDetail] = useState<ReactNode>('')

    useEffect(() => {
        setDetail(getDiagnostic())
    }, [])

    return (
        <Callout kind={CalloutKind.Error}>
            This browser does not support <a style={boldA} href="https://caniuse.com/web-bluetooth">Web Bluetooth</a>.<br />
            we need that to communicate with your bike<br />
            {detail}
        </Callout>
    )
}

function getDiagnostic(): ReactNode {
    const parser = new UAParser()
    const os = parser.getOS().name?.toLowerCase()
    const browser = parser.getBrowser().name?.toLowerCase()

    if (!window.isSecureContext) {
        return <>
            <br />
            <b>Not a secure context.</b> Web Bluetooth requires HTTPS or <span style={code}>localhost</span>.
            Make sure you are accessing the app via <span style={code}>http://localhost:3000</span> and not an IP address or a custom hostname.
        </>
    }

    if (os === 'linux' || os?.includes('linux')) {
        return <>
            <br />
            <b>Linux detected.</b> Chrome hides Web Bluetooth behind a flag on Linux.<br />
            Open <span style={code}>chrome://flags/#enable-experimental-web-platform-features</span>,
            set it to <b>Enabled</b>, then relaunch Chrome.
        </>
    }

    if (os === 'ios') {
        return <>On iOS you might want to try <a style={boldA} href='https://apps.apple.com/us/app/bluefy-web-ble-browser/id1492822055'>Bluefy – Web BLE Browser</a></>
    }

    if (browser === 'chrome') return undefined

    if (os === 'windows') return <>You might want to use Chrome or Edge</>

    return <>You might want to use Chrome</>
}
