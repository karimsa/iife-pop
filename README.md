<h2 align="center">((){}())</h2>
<h1 align="center">iife-pop</h1>
<p align="center">Pop IIFEs at compile-time.</p>

## Usage

**Install** & **add** to your babel plugins list: `iife-pop`.

## Motivation

A large number of compile-time transformations can be simplified or optimized through the
assumption that an IIFE can be popped. The idea behind "popping" an iife is to replace it
with a block of code at the same level as the caller of the iife rather than as a nested
expression.

For instance:

```javascript
const myValue = (function (arg) {
  switch (arg) {
    case 'A':
    return 0

    case 'B':
    return 1

    case 'C':
    return 2

    default:
    return 3
  }
}( 'some-value' ))
```

Can be simplified to:

```javascript
let myValue = 3

if (arg === 'A') myValue = 0
else if (arg === 'B') myValue = 1
else if (arg === 'C') myValue = 2
```

The beautiful thing about this is that now that we have removed the IIFE, if the value of `arg` can
be determined at compile-time, we can actually reduce all of this code down to a single variable declaration.

## License

Licensed under MIT license.

Copyright (C) 2018-present Karim Alibhai.
