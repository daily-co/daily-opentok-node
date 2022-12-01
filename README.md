# daily-opentok-node

This library is a drop-in replacement for the [opentok](https://www.npmjs.com/package/opentok) npm package. This allows a user to create rooms in Daily using the same API. Use this as a first step towards migrating from OpenTok to Daily.

Install via npm:

```bash
npm install daily-opentok-node
```

When requiring the library in your project, change the following line:

```typescript
const OpenTok = require('opentok');
```

to this:

```typescript
const OpenTok = require('daily-opentok-node');
```

Also when creating a new `OT` object, replace any occurrences of the following code:

```typescript
const OT = new OpenTok('openTokAPIKey', 'openTokAPISecret');
```

with this:

```typescript
const OT = new OpenTok('dailyApiKey');
await OT.getDomainID();
```

<aside>
💡 Note: Daily’s authentication flow is a bit different than the OpenTok flow, so we have to include a call to `getDomainID()`.
</aside>
