import { useEffect, useState } from 'react'
import { Smartphone, WifiOff, CheckCircle2 } from 'lucide-react'
import { Card, Badge } from './ui'

export function AppInstall() {
  const [offline, setOffline] = useState(!navigator.onLine)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const [updateReady, setUpdateReady] = useState(false)
  const standalone = window.matchMedia('(display-mode: standalone)').matches
    || !!(navigator as Navigator & { standalone?: boolean }).standalone

  useEffect(() => {
    let alive = true
    const onlineChanged = () => setOffline(!navigator.onLine)
    const unavailable = () => setFailed(true)
    window.addEventListener('online', onlineChanged)
    window.addEventListener('offline', onlineChanged)
    window.addEventListener('leeratelier-offline-unavailable', unavailable)
    if ('serviceWorker' in navigator && import.meta.env.PROD) {
      void navigator.serviceWorker.ready.then(registration => {
        if (alive) { setReady(true); setUpdateReady(!!registration.waiting) }
      })
      void navigator.serviceWorker.getRegistration(import.meta.env.BASE_URL).then(registration => {
        if (alive && registration?.waiting) setUpdateReady(true)
      })
    }
    return () => {
      alive = false
      window.removeEventListener('online', onlineChanged)
      window.removeEventListener('offline', onlineChanged)
      window.removeEventListener('leeratelier-offline-unavailable', unavailable)
    }
  }, [])

  return <Card>
    <div className="section-heading compact"><h2>Leeratelier op je iPhone</h2><Smartphone size={24} className="teal-text"/></div>
    <Badge tone={offline ? 'amber' : 'teal'}>{offline ? 'Geen internetverbinding' : standalone ? 'Geopend als app' : 'Ook beschikbaar als webapp'}</Badge>
    {!standalone && <>
      <p>Open de gepubliceerde website in Safari op je iPhone. Tik op <b>Delen</b>, kies <b>Zet op beginscherm</b>, schakel <b>Open als webapp</b> in als die optie verschijnt en tik op <b>Voeg toe</b>.</p>
      <p>Je krijgt een eigen Leeratelier-icoon op je beginscherm. Daarna open je het leerplatform via dat icoon.</p>
    </>}
    <div className="notice">
      {ready ? <CheckCircle2 size={19}/> : <WifiOff size={19}/>}
      <span>{ready ? 'De cursus en appbestanden zijn op dit apparaat klaargezet voor offline gebruik.' : failed ? 'Offline klaarzetten is niet gelukt. Open de app opnieuw met internet; online studeren blijft mogelijk.' : 'Open de app eerst met internet. De gebouwde versie zet de cursus klaar voor offline gebruik zodra je browser dit ondersteunt.'}</span>
    </div>
    {updateReady && <p className="teal-text small">Er staat een nieuwe appversie klaar. Sluit alle vensters van Leeratelier en open de app opnieuw wanneer je klaar bent met studeren.</p>}
    <p className="small muted">Voortgang staat lokaal op dit apparaat. Exporteer op je computer een JSON-back-up en importeer die hier als je je voortgang wilt meenemen. Controleer je gegevens ook na installatie op het beginscherm. Maak regelmatig een back-up; browseropslag kan worden gewist.</p>
  </Card>
}
