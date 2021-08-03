<h1 align="center">Tarkov Market</h1>

<p align="center">Unofficial NodeJS client for the tarkov-market.com</p>

<hr/>

<p>
  Simple client/wrapper for the tarkov-market.com API
</p>

<h3>Features</h3>

<ul>
  <li>✨ Fully Typed</li>
  <li>💾 Supports Caching</li>
  <li>🤖 Built-in mirror selection</li>
</ul>

<h3> Code Demo </h3>

```typescript
import TarkovMarket from 'tarkov-market';

async function demo () {
  const client = new TarkovMarket('myapikey');
  // Get all items
  const items = await client.getAll();
  console.log(`Got ${items.length} items`);
  // Get a single item
  const item = await client.getItem("f0fa8457-6638-4ad2-b7e8-4708033d8f39");
  console.log(`Look, it's a ${item.name} !`); // Output: Look, it's a Secure Flash drive !
  // Search for items
  const searchResults = await client.search("secure flash");
  console.log(`Search results: `, searchResults);
}

demo();

```

<h3>Download & Installation</h3>

```shell
$ yarn add tarkov-market
```
or `npm install tarkov-market`
<h3>Contributing</h3>
Keep your code readable. For big features, open an issue in advance.

<h3>Authors</h3>
<ul>
  <li><a href="https://itsrems.com">Nicolas Theck</a></li>
</ul>

<h3>License</h3>

This project is licensed under the MIT License