# queer_map

A map application for discovering queer-friendly locations.

## TODOs

### Cookie & Privacy Policy Updates

#### DSGVO Text Updates
- [ ] Update DSGVO text to explicitly list:
  - What cookies are used
  - Their specific purposes
  - Duration of storage
  - Any third-party cookies

#### Cookie Implementation
- [ ] Implement cookie handling:
  - [ ] Add analytics initialization in `handleCookieAccept`
  - [ ] Add cookie removal logic in `handleCookieReject`
  - [ ] Add consent status check before setting non-essential cookies 