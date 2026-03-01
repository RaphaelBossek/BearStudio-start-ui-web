Erstelle eine Liste von Sprechstunden (Sprechstundenplan).

Die Definition eines Eintrags im Sprechstundenplan ist:
- Eine Dienstleistung
- Einen Wochentag
- Ein Startdatum
- Ein Datum der letzten Wiederholung
- Einer Anzahl von Wiederholungen
- Die Eigenschaft der Wiederholung ist entweder:
  - Wöchentlich
  - Erster Tag im Monats
  - jeder x-te Tag im Monat
  - Tag im Monat
  - Letzter Tag im Monat
- Einer Startuhrzeit
- Eine Enduhrzeit
- Einen zugewiesenen Experten
- Einen zugewiesenen Ort
- Zugewiesenen Kunden
- Einen Enddatum
- Einem Kommentar

Die Abrechnungsmodalität einer Dienstleistung ist entweder:
- Patienten (Bereitschaft)
- Zeit (Sprechstunde, Therapie)
- Experten+Zeit (Konsil)

Eine Fachrichtung ist entweder:
- Allgemeinmedizin
- Psychiatrie
- Dermatologie
- Substitution
- Psychotherapie
- Physiotherapie

Erstelle eine Liste von Dienstleistungen.

Die Definition einer Dienstleistung ist:
- Einen Titel,
  - als interne Bezeichnung innerhalb des Systems
  - denn der Experte sieht
  - auf der Rechnung steht
- Eine Kurzbezeichnung
- Eine Farbe
- Eine Sortierreihenfolge als Index für eine Liste
- Die Abrechnungsmodalität
- Die Fachrichtung
- Welche der nachfolgenden Konsultations-Typen mit der Dienstleistung erbracht und vom Experten vor der Behandlung ausgewählt werden können:
  - extern
  - Konsiliarbericht
  - Normale Konsultation
  - Komplette Zugangsuntersuchung
  - Kurze Zugangsuntersuchung
  - Gewahrsamstauglichkeit
- Von den möglichen Konsultationstypen kann einer als Vorauswahl für eine Dienstleistung vorausgewählt werden.
- Eine Voreinstellung für die weitere Behandlung, die sein kann:
  - Einweisung
  - Wiedervorstellung bei Verschlechterung oder Persistenz
  - Folgetermin
  - Überweisung
- Eine Auswahl von Fähigkeiten, die Voraussetzung für die Dienstleistung sind. Dabei kann bestimmt werden, ob eine oder alle der Fähigkeiten vorausgesetzt werden. Diese Fähigkeiten muss ein Experte vorweisen, um für die Dienstleistung ausgewählt werden zu können.

Erstelle eine List der Fähigkeiten.

Eine Fähigkeit besteht aus folgenden Elementen:
- Eine Bezeichnung der Fähigkeit
- Eine Beschreibung
- Art der Fähigkeit. Die Art der Fähigkeit ist entweder:
  - Fachrichtung
  - Zusatzausbildung
  - Fort- und Weiterbildung
  - Sprache 
- Ob die Fähigkeit aktiv oder deaktiviert ist? Ja, nein.
- Ob für die Fähigkeit ein Zertifikat benötigt wird? Ja, nein.

Erstelle eine List von Ausschlusskriterien.

Ein Ausschlusskriterium besteht aus folgenden Elementen:
- Eine Bezeichnung des Ausschlusskriteriums
- Eine Beschreibung
- Eine Gewichtung als Zahl 
- Ob das Ausschlusskriterium aktiv oder deaktiviert ist? Ja, nein.

Zu Dienstleistungsformen gehören:
- Bereitschaftsdienst
- Sprechstunde
- Therapie

Die Art der Rechnungsadresse kann sein:
- Wohnsitz
- Zweitwohnsitz
- Arbeit
- Praxis
- sonstiges

Im Jahreskalender eines Experten sind die Verfügbarkeit (Unbekannt, Ja, Nein) für alle Dienstleistungsformen gespeichert. Für jeden Tag kann der Experte seine Verfügbarkeit in den einzelnen Schichten eintragen. Durch Anklicken eines Datums ändert sich die Verfügbarkeit wie folgt: Ja -> Nein -> Unbekannt -> Ja u.s.w. Der Experte kann auch für jeden Dienstleistungs-Typ einzeln und jeden Tag einzeln die Verfügbarkeit festlegen. Ist der Experte für eine Dienstleistung eingeplant, so wird dies auch im Experten-Einsatzkalender angezeigt mit einem Hinweis zu den Uhrzeiten und einem Link zu Termindetails.

Die Bereitschaft wird unterteilt in Vormittagsschicht (8:00 Uhr bis 13:00 Uhr), Nachmittagsschicht (13:00 Uhr bis 18:00 Uhr) und Nachtschicht (18:00 Uhr bis 8:00 Uhr in der Früh am nächsten Tag).

Die Sprechstunde wird in eine Vormittagsschicht und Nachmittagsschicht unterteilt. Es gibt keine Nachtschicht für Sprechstunden.

Die Therapie hat keine Unterteilung in Schichten und findet zwischen 8:00 Uhr und 18:00 Uhr statt.

Ein Experte besteht aus folgenden Elementen:
- Einen Namen
- Einen Vornamen
- einen akademischen Titel
- Anrede
- Persönliches Passwort für den Experten zum Login
- Ob das Konto des Experten aktiv oder deaktiviert ist
- Eine primäre und sekundäre E-Mail-Adresse
- Weiterleitung von Nachrichten an E-Mail aktiviert oder deaktiviert?
- Eine Telefonnummer für die Bereitschaft
- Geburtsdatum 
- Ein Bild mit der Unterschrift
- Zugangsdaten zu der SecureBox bestehen aus:
  - Benutzername
  - Passwort
- Ein Datum, für
  - ab wann der Experte als Arzt tätig ist
  - ab wann der Experte für die Videoclinic als Arzt tätig ist
  - bis wann der Experte für die Videoclinic als Arzt tätig war
- Debitorennummer (GKTO)
- Debitorenkonto (GKTK)
- Einheitliche Fortbildungsnummer (EFN)
- Datum, wann dem Auftragsdatenverarbeitungsantrag (AVV) zugestimmt wurde
- Status des Kontos. Der Status des Kontos kann sein:
  - Aktiv
  - Vorregistriert
  - Krankenstand, nicht verfügbar
  - inaktiv/abgemeldet
- Falls der Status des Kontos auf Krankenstand nicht verfügbar eingestellt ist, können das Start- und Enddatum festgelegt werden. 
- Beschreibung als Text
- Vertragsverhältnis mit der Videoclinic*************
  - Datum mit dem Vertragsabschluss
  - Vertragsnummer
- Umsatzsteuernummer
- Steuer-ID
- Kontoverbindung:
  - IBAN
  - Kreditinstitut
  - BIC 
- Qualifikationsniveau. Das Qualifikationsniveau kann sein:
  - Onboarding
  - Anfänger
  - Amateur
  - Profi
- Praxiserfahrung in Suchtmedizin. Die Praxiserfahrung in Suchtmedizin kann sein, entweder:
  - sehr hoch
  - hoch
  - mittel
  - niedrig
  - sehr niedrig
- Fokus und Hingabe. Fokus und Hingabe sind unterteilt in:
  - Bereitschaftsdienst: keine, niedrig, mittel, hoch
  - Sprechstunde: keine, niedrig, mittel, hoch
  - Therapie: keine, niedrig, mittel, hoch
- Rechnungsadresse. Die Rechnungsadresse besteht aus den Elementen:
  - Empfänger
  - Straße
  - Hausnummer
  - Zusatz
  - Postleitzahl
  - Ort
  - Bundesland
  - Land
  - Art der Rechnungsadresse
  - Für jede Art der Rechnungsadresse kann nur eine Rechnungsadresse pro Experte angelegt werden.
- Eine Liste der Fähigkeiten. Pro Fähigkeit, ein Datum ab wann diese erlangt worden ist. Die Fähigkeit kann aus einer Liste der im System eingerichteten Fähigkeiten ausgewählt werden. Zu jeder Fähigkeit kann auch ein Dokument/Datei beigefügt und gelöscht werden.
- Eine Liste von Ausschlusskriterien. Ein Ausschlusskriterium kann aus der systemweit eingerichteten Liste der Ausschlusskriterien ausgewählt werden.
- Eine Liste mit Dateien, die dem Experten zugewiesen sind und vom Experten hochgeladen werden können.
- Einen Jahreskalender des Experten
- Liste abonnierter Waren durch den Experten
  - Die Liste abonnierter Waren besteht aus:
    - Anzahl/Menge
    - Ware
    - Startdatum
    - Enddatum
    - Listenpreis
    - Angebotspreis
    - Totalpreis (Angebotspreis * Anzahl)
    - Beschreibung
    - Kommentar
  - Option, ob eine Email-Rechnung an den Experten gesendet werden soll (wird nur bei erfolgreicher Abrechnung gesendet)
  - Option, ob eine Post-Rechnung an den Experten gesendet werden soll (wird nur bei erfolgreicher Abrechnung gesendet)

Erstelle eine Liste der Experten.


