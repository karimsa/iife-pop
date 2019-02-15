<h1 align="center">iife-pop</h1>

<p align="center">
  <a href='https://semaphoreci.com/karimsaprojects/iife-pop'> <img src='https://semaphoreci.com/api/v1/projects/ab0094e9-cd40-44eb-9d47-624e5eddf269/2516511/badge.svg' alt='Build Status'></a>
</p>

Remove IIFE-s at compile-time.

## Motivation

The purpose of this babel plugin is to be able to evaluate & remove the existence of
an IIFE at compile-time where it is possible to do so. The idea is to simplify code as
much as possible at compile-time so that optimizations such as constant-folding can actually
reduce code even further than they currently do.

As an example, look at this code:

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

Modern-day minifiers such as babel-minify and uglify-js are able to reduce this down to:

```javascript
const myValue=function(a){return'A'===a?0:'B'===a?1:'C'===a?2:3}('some-value');
```

Though this saves quite a few bytes via mangling, constant folding is not able to take place
because of the IIFE. If we replace the IIFE in the original code, it might look something like this:

```javascript
const _arg = 'some-value'
let _returnValue

switch (_arg) {
  case 'A':
    _returnValue = 0
    break

  case 'B':
    _returnValue = 1
    break

  case 'C':
    _returnValue = 2
    break

  default:
    _returnValue = 3
    break
}

const myValue = _arg
```

The code is the same, just without an IIFE. This new code can be minified down to:

```javascript
const myValue=3;
```

Which saves a further 63 bytes in this case (~80%) - plus much less work for the runtime to do.

## License

Licensed under MIT license.

Copyright (C) 2018-present Karim Alibhai.

