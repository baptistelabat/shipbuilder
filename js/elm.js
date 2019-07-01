// (c) Naval Group / Sirehna 2019. All rights reserved
(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}

console.warn('Compiled in DEV mode. Follow the advice at https://elm-lang.org/0.19.0/optimize for better performance and smaller assets.');


var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log_UNUSED = F2(function(tag, value)
{
	return value;
});

var _Debug_log = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString_UNUSED(value)
{
	return '<internals>';
}

function _Debug_toString(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File === 'function' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[94m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash_UNUSED(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.start.line === region.end.line)
	{
		return 'on line ' + region.start.line;
	}
	return 'on lines ' + region.start.line + ' through ' + region.end.line;
}



// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	/**/
	if (x.$ === 'Set_elm_builtin')
	{
		x = elm$core$Set$toList(x);
		y = elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = elm$core$Dict$toList(x);
		y = elm$core$Dict$toList(y);
	}
	//*/

	/**_UNUSED/
	if (x.$ < 0)
	{
		x = elm$core$Dict$toList(x);
		y = elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**_UNUSED/
	if (typeof x.$ === 'undefined')
	//*/
	/**/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? elm$core$Basics$LT : n ? elm$core$Basics$GT : elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0_UNUSED = 0;
var _Utils_Tuple0 = { $: '#0' };

function _Utils_Tuple2_UNUSED(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3_UNUSED(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr_UNUSED(c) { return c; }
function _Utils_chr(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil_UNUSED = { $: 0 };
var _List_Nil = { $: '[]' };

function _List_Cons_UNUSED(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === elm$core$Basics$EQ ? 0 : ord === elm$core$Basics$LT ? -1 : 1;
	}));
});


/*
 * Copyright (c) 2010 Mozilla Corporation
 * Copyright (c) 2010 Vladimir Vukicevic
 * Copyright (c) 2013 John Mayer
 * Copyright (c) 2018 Andrey Kuzmin
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

// Vector2

var _MJS_v2 = F2(function(x, y) {
    return new Float64Array([x, y]);
});

var _MJS_v2getX = function(a) {
    return a[0];
};

var _MJS_v2getY = function(a) {
    return a[1];
};

var _MJS_v2setX = F2(function(x, a) {
    return new Float64Array([x, a[1]]);
});

var _MJS_v2setY = F2(function(y, a) {
    return new Float64Array([a[0], y]);
});

var _MJS_v2toRecord = function(a) {
    return { x: a[0], y: a[1] };
};

var _MJS_v2fromRecord = function(r) {
    return new Float64Array([r.x, r.y]);
};

var _MJS_v2add = F2(function(a, b) {
    var r = new Float64Array(2);
    r[0] = a[0] + b[0];
    r[1] = a[1] + b[1];
    return r;
});

var _MJS_v2sub = F2(function(a, b) {
    var r = new Float64Array(2);
    r[0] = a[0] - b[0];
    r[1] = a[1] - b[1];
    return r;
});

var _MJS_v2negate = function(a) {
    var r = new Float64Array(2);
    r[0] = -a[0];
    r[1] = -a[1];
    return r;
};

var _MJS_v2direction = F2(function(a, b) {
    var r = new Float64Array(2);
    r[0] = a[0] - b[0];
    r[1] = a[1] - b[1];
    var im = 1.0 / _MJS_v2lengthLocal(r);
    r[0] = r[0] * im;
    r[1] = r[1] * im;
    return r;
});

function _MJS_v2lengthLocal(a) {
    return Math.sqrt(a[0] * a[0] + a[1] * a[1]);
}
var _MJS_v2length = _MJS_v2lengthLocal;

var _MJS_v2lengthSquared = function(a) {
    return a[0] * a[0] + a[1] * a[1];
};

var _MJS_v2distance = F2(function(a, b) {
    var dx = a[0] - b[0];
    var dy = a[1] - b[1];
    return Math.sqrt(dx * dx + dy * dy);
});

var _MJS_v2distanceSquared = F2(function(a, b) {
    var dx = a[0] - b[0];
    var dy = a[1] - b[1];
    return dx * dx + dy * dy;
});

var _MJS_v2normalize = function(a) {
    var r = new Float64Array(2);
    var im = 1.0 / _MJS_v2lengthLocal(a);
    r[0] = a[0] * im;
    r[1] = a[1] * im;
    return r;
};

var _MJS_v2scale = F2(function(k, a) {
    var r = new Float64Array(2);
    r[0] = a[0] * k;
    r[1] = a[1] * k;
    return r;
});

var _MJS_v2dot = F2(function(a, b) {
    return a[0] * b[0] + a[1] * b[1];
});

// Vector3

var _MJS_v3temp1Local = new Float64Array(3);
var _MJS_v3temp2Local = new Float64Array(3);
var _MJS_v3temp3Local = new Float64Array(3);

var _MJS_v3 = F3(function(x, y, z) {
    return new Float64Array([x, y, z]);
});

var _MJS_v3getX = function(a) {
    return a[0];
};

var _MJS_v3getY = function(a) {
    return a[1];
};

var _MJS_v3getZ = function(a) {
    return a[2];
};

var _MJS_v3setX = F2(function(x, a) {
    return new Float64Array([x, a[1], a[2]]);
});

var _MJS_v3setY = F2(function(y, a) {
    return new Float64Array([a[0], y, a[2]]);
});

var _MJS_v3setZ = F2(function(z, a) {
    return new Float64Array([a[0], a[1], z]);
});

var _MJS_v3toRecord = function(a) {
    return { x: a[0], y: a[1], z: a[2] };
};

var _MJS_v3fromRecord = function(r) {
    return new Float64Array([r.x, r.y, r.z]);
};

var _MJS_v3add = F2(function(a, b) {
    var r = new Float64Array(3);
    r[0] = a[0] + b[0];
    r[1] = a[1] + b[1];
    r[2] = a[2] + b[2];
    return r;
});

function _MJS_v3subLocal(a, b, r) {
    if (r === undefined) {
        r = new Float64Array(3);
    }
    r[0] = a[0] - b[0];
    r[1] = a[1] - b[1];
    r[2] = a[2] - b[2];
    return r;
}
var _MJS_v3sub = F2(_MJS_v3subLocal);

var _MJS_v3negate = function(a) {
    var r = new Float64Array(3);
    r[0] = -a[0];
    r[1] = -a[1];
    r[2] = -a[2];
    return r;
};

function _MJS_v3directionLocal(a, b, r) {
    if (r === undefined) {
        r = new Float64Array(3);
    }
    return _MJS_v3normalizeLocal(_MJS_v3subLocal(a, b, r), r);
}
var _MJS_v3direction = F2(_MJS_v3directionLocal);

function _MJS_v3lengthLocal(a) {
    return Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]);
}
var _MJS_v3length = _MJS_v3lengthLocal;

var _MJS_v3lengthSquared = function(a) {
    return a[0] * a[0] + a[1] * a[1] + a[2] * a[2];
};

var _MJS_v3distance = F2(function(a, b) {
    var dx = a[0] - b[0];
    var dy = a[1] - b[1];
    var dz = a[2] - b[2];
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
});

var _MJS_v3distanceSquared = F2(function(a, b) {
    var dx = a[0] - b[0];
    var dy = a[1] - b[1];
    var dz = a[2] - b[2];
    return dx * dx + dy * dy + dz * dz;
});

function _MJS_v3normalizeLocal(a, r) {
    if (r === undefined) {
        r = new Float64Array(3);
    }
    var im = 1.0 / _MJS_v3lengthLocal(a);
    r[0] = a[0] * im;
    r[1] = a[1] * im;
    r[2] = a[2] * im;
    return r;
}
var _MJS_v3normalize = _MJS_v3normalizeLocal;

var _MJS_v3scale = F2(function(k, a) {
    return new Float64Array([a[0] * k, a[1] * k, a[2] * k]);
});

var _MJS_v3dotLocal = function(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
};
var _MJS_v3dot = F2(_MJS_v3dotLocal);

function _MJS_v3crossLocal(a, b, r) {
    if (r === undefined) {
        r = new Float64Array(3);
    }
    r[0] = a[1] * b[2] - a[2] * b[1];
    r[1] = a[2] * b[0] - a[0] * b[2];
    r[2] = a[0] * b[1] - a[1] * b[0];
    return r;
}
var _MJS_v3cross = F2(_MJS_v3crossLocal);

var _MJS_v3mul4x4 = F2(function(m, v) {
    var w;
    var tmp = _MJS_v3temp1Local;
    var r = new Float64Array(3);

    tmp[0] = m[3];
    tmp[1] = m[7];
    tmp[2] = m[11];
    w = _MJS_v3dotLocal(v, tmp) + m[15];
    tmp[0] = m[0];
    tmp[1] = m[4];
    tmp[2] = m[8];
    r[0] = (_MJS_v3dotLocal(v, tmp) + m[12]) / w;
    tmp[0] = m[1];
    tmp[1] = m[5];
    tmp[2] = m[9];
    r[1] = (_MJS_v3dotLocal(v, tmp) + m[13]) / w;
    tmp[0] = m[2];
    tmp[1] = m[6];
    tmp[2] = m[10];
    r[2] = (_MJS_v3dotLocal(v, tmp) + m[14]) / w;
    return r;
});

// Vector4

var _MJS_v4 = F4(function(x, y, z, w) {
    return new Float64Array([x, y, z, w]);
});

var _MJS_v4getX = function(a) {
    return a[0];
};

var _MJS_v4getY = function(a) {
    return a[1];
};

var _MJS_v4getZ = function(a) {
    return a[2];
};

var _MJS_v4getW = function(a) {
    return a[3];
};

var _MJS_v4setX = F2(function(x, a) {
    return new Float64Array([x, a[1], a[2], a[3]]);
});

var _MJS_v4setY = F2(function(y, a) {
    return new Float64Array([a[0], y, a[2], a[3]]);
});

var _MJS_v4setZ = F2(function(z, a) {
    return new Float64Array([a[0], a[1], z, a[3]]);
});

var _MJS_v4setW = F2(function(w, a) {
    return new Float64Array([a[0], a[1], a[2], w]);
});

var _MJS_v4toRecord = function(a) {
    return { x: a[0], y: a[1], z: a[2], w: a[3] };
};

var _MJS_v4fromRecord = function(r) {
    return new Float64Array([r.x, r.y, r.z, r.w]);
};

var _MJS_v4add = F2(function(a, b) {
    var r = new Float64Array(4);
    r[0] = a[0] + b[0];
    r[1] = a[1] + b[1];
    r[2] = a[2] + b[2];
    r[3] = a[3] + b[3];
    return r;
});

var _MJS_v4sub = F2(function(a, b) {
    var r = new Float64Array(4);
    r[0] = a[0] - b[0];
    r[1] = a[1] - b[1];
    r[2] = a[2] - b[2];
    r[3] = a[3] - b[3];
    return r;
});

var _MJS_v4negate = function(a) {
    var r = new Float64Array(4);
    r[0] = -a[0];
    r[1] = -a[1];
    r[2] = -a[2];
    r[3] = -a[3];
    return r;
};

var _MJS_v4direction = F2(function(a, b) {
    var r = new Float64Array(4);
    r[0] = a[0] - b[0];
    r[1] = a[1] - b[1];
    r[2] = a[2] - b[2];
    r[3] = a[3] - b[3];
    var im = 1.0 / _MJS_v4lengthLocal(r);
    r[0] = r[0] * im;
    r[1] = r[1] * im;
    r[2] = r[2] * im;
    r[3] = r[3] * im;
    return r;
});

function _MJS_v4lengthLocal(a) {
    return Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2] + a[3] * a[3]);
}
var _MJS_v4length = _MJS_v4lengthLocal;

var _MJS_v4lengthSquared = function(a) {
    return a[0] * a[0] + a[1] * a[1] + a[2] * a[2] + a[3] * a[3];
};

var _MJS_v4distance = F2(function(a, b) {
    var dx = a[0] - b[0];
    var dy = a[1] - b[1];
    var dz = a[2] - b[2];
    var dw = a[3] - b[3];
    return Math.sqrt(dx * dx + dy * dy + dz * dz + dw * dw);
});

var _MJS_v4distanceSquared = F2(function(a, b) {
    var dx = a[0] - b[0];
    var dy = a[1] - b[1];
    var dz = a[2] - b[2];
    var dw = a[3] - b[3];
    return dx * dx + dy * dy + dz * dz + dw * dw;
});

var _MJS_v4normalize = function(a) {
    var r = new Float64Array(4);
    var im = 1.0 / _MJS_v4lengthLocal(a);
    r[0] = a[0] * im;
    r[1] = a[1] * im;
    r[2] = a[2] * im;
    r[3] = a[3] * im;
    return r;
};

var _MJS_v4scale = F2(function(k, a) {
    var r = new Float64Array(4);
    r[0] = a[0] * k;
    r[1] = a[1] * k;
    r[2] = a[2] * k;
    r[3] = a[3] * k;
    return r;
});

var _MJS_v4dot = F2(function(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
});

// Matrix4

var _MJS_m4x4temp1Local = new Float64Array(16);
var _MJS_m4x4temp2Local = new Float64Array(16);

var _MJS_m4x4identity = new Float64Array([
    1.0, 0.0, 0.0, 0.0,
    0.0, 1.0, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    0.0, 0.0, 0.0, 1.0
]);

var _MJS_m4x4fromRecord = function(r) {
    var m = new Float64Array(16);
    m[0] = r.m11;
    m[1] = r.m21;
    m[2] = r.m31;
    m[3] = r.m41;
    m[4] = r.m12;
    m[5] = r.m22;
    m[6] = r.m32;
    m[7] = r.m42;
    m[8] = r.m13;
    m[9] = r.m23;
    m[10] = r.m33;
    m[11] = r.m43;
    m[12] = r.m14;
    m[13] = r.m24;
    m[14] = r.m34;
    m[15] = r.m44;
    return m;
};

var _MJS_m4x4toRecord = function(m) {
    return {
        m11: m[0], m21: m[1], m31: m[2], m41: m[3],
        m12: m[4], m22: m[5], m32: m[6], m42: m[7],
        m13: m[8], m23: m[9], m33: m[10], m43: m[11],
        m14: m[12], m24: m[13], m34: m[14], m44: m[15]
    };
};

var _MJS_m4x4inverse = function(m) {
    var r = new Float64Array(16);

    r[0] = m[5] * m[10] * m[15] - m[5] * m[11] * m[14] - m[9] * m[6] * m[15] +
        m[9] * m[7] * m[14] + m[13] * m[6] * m[11] - m[13] * m[7] * m[10];
    r[4] = -m[4] * m[10] * m[15] + m[4] * m[11] * m[14] + m[8] * m[6] * m[15] -
        m[8] * m[7] * m[14] - m[12] * m[6] * m[11] + m[12] * m[7] * m[10];
    r[8] = m[4] * m[9] * m[15] - m[4] * m[11] * m[13] - m[8] * m[5] * m[15] +
        m[8] * m[7] * m[13] + m[12] * m[5] * m[11] - m[12] * m[7] * m[9];
    r[12] = -m[4] * m[9] * m[14] + m[4] * m[10] * m[13] + m[8] * m[5] * m[14] -
        m[8] * m[6] * m[13] - m[12] * m[5] * m[10] + m[12] * m[6] * m[9];
    r[1] = -m[1] * m[10] * m[15] + m[1] * m[11] * m[14] + m[9] * m[2] * m[15] -
        m[9] * m[3] * m[14] - m[13] * m[2] * m[11] + m[13] * m[3] * m[10];
    r[5] = m[0] * m[10] * m[15] - m[0] * m[11] * m[14] - m[8] * m[2] * m[15] +
        m[8] * m[3] * m[14] + m[12] * m[2] * m[11] - m[12] * m[3] * m[10];
    r[9] = -m[0] * m[9] * m[15] + m[0] * m[11] * m[13] + m[8] * m[1] * m[15] -
        m[8] * m[3] * m[13] - m[12] * m[1] * m[11] + m[12] * m[3] * m[9];
    r[13] = m[0] * m[9] * m[14] - m[0] * m[10] * m[13] - m[8] * m[1] * m[14] +
        m[8] * m[2] * m[13] + m[12] * m[1] * m[10] - m[12] * m[2] * m[9];
    r[2] = m[1] * m[6] * m[15] - m[1] * m[7] * m[14] - m[5] * m[2] * m[15] +
        m[5] * m[3] * m[14] + m[13] * m[2] * m[7] - m[13] * m[3] * m[6];
    r[6] = -m[0] * m[6] * m[15] + m[0] * m[7] * m[14] + m[4] * m[2] * m[15] -
        m[4] * m[3] * m[14] - m[12] * m[2] * m[7] + m[12] * m[3] * m[6];
    r[10] = m[0] * m[5] * m[15] - m[0] * m[7] * m[13] - m[4] * m[1] * m[15] +
        m[4] * m[3] * m[13] + m[12] * m[1] * m[7] - m[12] * m[3] * m[5];
    r[14] = -m[0] * m[5] * m[14] + m[0] * m[6] * m[13] + m[4] * m[1] * m[14] -
        m[4] * m[2] * m[13] - m[12] * m[1] * m[6] + m[12] * m[2] * m[5];
    r[3] = -m[1] * m[6] * m[11] + m[1] * m[7] * m[10] + m[5] * m[2] * m[11] -
        m[5] * m[3] * m[10] - m[9] * m[2] * m[7] + m[9] * m[3] * m[6];
    r[7] = m[0] * m[6] * m[11] - m[0] * m[7] * m[10] - m[4] * m[2] * m[11] +
        m[4] * m[3] * m[10] + m[8] * m[2] * m[7] - m[8] * m[3] * m[6];
    r[11] = -m[0] * m[5] * m[11] + m[0] * m[7] * m[9] + m[4] * m[1] * m[11] -
        m[4] * m[3] * m[9] - m[8] * m[1] * m[7] + m[8] * m[3] * m[5];
    r[15] = m[0] * m[5] * m[10] - m[0] * m[6] * m[9] - m[4] * m[1] * m[10] +
        m[4] * m[2] * m[9] + m[8] * m[1] * m[6] - m[8] * m[2] * m[5];

    var det = m[0] * r[0] + m[1] * r[4] + m[2] * r[8] + m[3] * r[12];

    if (det === 0) {
        return elm$core$Maybe$Nothing;
    }

    det = 1.0 / det;

    for (var i = 0; i < 16; i = i + 1) {
        r[i] = r[i] * det;
    }

    return elm$core$Maybe$Just(r);
};

var _MJS_m4x4inverseOrthonormal = function(m) {
    var r = _MJS_m4x4transposeLocal(m);
    var t = [m[12], m[13], m[14]];
    r[3] = r[7] = r[11] = 0;
    r[12] = -_MJS_v3dotLocal([r[0], r[4], r[8]], t);
    r[13] = -_MJS_v3dotLocal([r[1], r[5], r[9]], t);
    r[14] = -_MJS_v3dotLocal([r[2], r[6], r[10]], t);
    return r;
};

function _MJS_m4x4makeFrustumLocal(left, right, bottom, top, znear, zfar) {
    var r = new Float64Array(16);

    r[0] = 2 * znear / (right - left);
    r[1] = 0;
    r[2] = 0;
    r[3] = 0;
    r[4] = 0;
    r[5] = 2 * znear / (top - bottom);
    r[6] = 0;
    r[7] = 0;
    r[8] = (right + left) / (right - left);
    r[9] = (top + bottom) / (top - bottom);
    r[10] = -(zfar + znear) / (zfar - znear);
    r[11] = -1;
    r[12] = 0;
    r[13] = 0;
    r[14] = -2 * zfar * znear / (zfar - znear);
    r[15] = 0;

    return r;
}
var _MJS_m4x4makeFrustum = F6(_MJS_m4x4makeFrustumLocal);

var _MJS_m4x4makePerspective = F4(function(fovy, aspect, znear, zfar) {
    var ymax = znear * Math.tan(fovy * Math.PI / 360.0);
    var ymin = -ymax;
    var xmin = ymin * aspect;
    var xmax = ymax * aspect;

    return _MJS_m4x4makeFrustumLocal(xmin, xmax, ymin, ymax, znear, zfar);
});

function _MJS_m4x4makeOrthoLocal(left, right, bottom, top, znear, zfar) {
    var r = new Float64Array(16);

    r[0] = 2 / (right - left);
    r[1] = 0;
    r[2] = 0;
    r[3] = 0;
    r[4] = 0;
    r[5] = 2 / (top - bottom);
    r[6] = 0;
    r[7] = 0;
    r[8] = 0;
    r[9] = 0;
    r[10] = -2 / (zfar - znear);
    r[11] = 0;
    r[12] = -(right + left) / (right - left);
    r[13] = -(top + bottom) / (top - bottom);
    r[14] = -(zfar + znear) / (zfar - znear);
    r[15] = 1;

    return r;
}
var _MJS_m4x4makeOrtho = F6(_MJS_m4x4makeOrthoLocal);

var _MJS_m4x4makeOrtho2D = F4(function(left, right, bottom, top) {
    return _MJS_m4x4makeOrthoLocal(left, right, bottom, top, -1, 1);
});

function _MJS_m4x4mulLocal(a, b) {
    var r = new Float64Array(16);
    var a11 = a[0];
    var a21 = a[1];
    var a31 = a[2];
    var a41 = a[3];
    var a12 = a[4];
    var a22 = a[5];
    var a32 = a[6];
    var a42 = a[7];
    var a13 = a[8];
    var a23 = a[9];
    var a33 = a[10];
    var a43 = a[11];
    var a14 = a[12];
    var a24 = a[13];
    var a34 = a[14];
    var a44 = a[15];
    var b11 = b[0];
    var b21 = b[1];
    var b31 = b[2];
    var b41 = b[3];
    var b12 = b[4];
    var b22 = b[5];
    var b32 = b[6];
    var b42 = b[7];
    var b13 = b[8];
    var b23 = b[9];
    var b33 = b[10];
    var b43 = b[11];
    var b14 = b[12];
    var b24 = b[13];
    var b34 = b[14];
    var b44 = b[15];

    r[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
    r[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
    r[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
    r[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
    r[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
    r[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
    r[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
    r[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
    r[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
    r[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
    r[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
    r[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
    r[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;
    r[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;
    r[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;
    r[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

    return r;
}
var _MJS_m4x4mul = F2(_MJS_m4x4mulLocal);

var _MJS_m4x4mulAffine = F2(function(a, b) {
    var r = new Float64Array(16);
    var a11 = a[0];
    var a21 = a[1];
    var a31 = a[2];
    var a12 = a[4];
    var a22 = a[5];
    var a32 = a[6];
    var a13 = a[8];
    var a23 = a[9];
    var a33 = a[10];
    var a14 = a[12];
    var a24 = a[13];
    var a34 = a[14];

    var b11 = b[0];
    var b21 = b[1];
    var b31 = b[2];
    var b12 = b[4];
    var b22 = b[5];
    var b32 = b[6];
    var b13 = b[8];
    var b23 = b[9];
    var b33 = b[10];
    var b14 = b[12];
    var b24 = b[13];
    var b34 = b[14];

    r[0] = a11 * b11 + a12 * b21 + a13 * b31;
    r[1] = a21 * b11 + a22 * b21 + a23 * b31;
    r[2] = a31 * b11 + a32 * b21 + a33 * b31;
    r[3] = 0;
    r[4] = a11 * b12 + a12 * b22 + a13 * b32;
    r[5] = a21 * b12 + a22 * b22 + a23 * b32;
    r[6] = a31 * b12 + a32 * b22 + a33 * b32;
    r[7] = 0;
    r[8] = a11 * b13 + a12 * b23 + a13 * b33;
    r[9] = a21 * b13 + a22 * b23 + a23 * b33;
    r[10] = a31 * b13 + a32 * b23 + a33 * b33;
    r[11] = 0;
    r[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14;
    r[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24;
    r[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34;
    r[15] = 1;

    return r;
});

var _MJS_m4x4makeRotate = F2(function(angle, axis) {
    var r = new Float64Array(16);
    axis = _MJS_v3normalizeLocal(axis, _MJS_v3temp1Local);
    var x = axis[0];
    var y = axis[1];
    var z = axis[2];
    var c = Math.cos(angle);
    var c1 = 1 - c;
    var s = Math.sin(angle);

    r[0] = x * x * c1 + c;
    r[1] = y * x * c1 + z * s;
    r[2] = z * x * c1 - y * s;
    r[3] = 0;
    r[4] = x * y * c1 - z * s;
    r[5] = y * y * c1 + c;
    r[6] = y * z * c1 + x * s;
    r[7] = 0;
    r[8] = x * z * c1 + y * s;
    r[9] = y * z * c1 - x * s;
    r[10] = z * z * c1 + c;
    r[11] = 0;
    r[12] = 0;
    r[13] = 0;
    r[14] = 0;
    r[15] = 1;

    return r;
});

var _MJS_m4x4rotate = F3(function(angle, axis, m) {
    var r = new Float64Array(16);
    var im = 1.0 / _MJS_v3lengthLocal(axis);
    var x = axis[0] * im;
    var y = axis[1] * im;
    var z = axis[2] * im;
    var c = Math.cos(angle);
    var c1 = 1 - c;
    var s = Math.sin(angle);
    var xs = x * s;
    var ys = y * s;
    var zs = z * s;
    var xyc1 = x * y * c1;
    var xzc1 = x * z * c1;
    var yzc1 = y * z * c1;
    var t11 = x * x * c1 + c;
    var t21 = xyc1 + zs;
    var t31 = xzc1 - ys;
    var t12 = xyc1 - zs;
    var t22 = y * y * c1 + c;
    var t32 = yzc1 + xs;
    var t13 = xzc1 + ys;
    var t23 = yzc1 - xs;
    var t33 = z * z * c1 + c;
    var m11 = m[0], m21 = m[1], m31 = m[2], m41 = m[3];
    var m12 = m[4], m22 = m[5], m32 = m[6], m42 = m[7];
    var m13 = m[8], m23 = m[9], m33 = m[10], m43 = m[11];
    var m14 = m[12], m24 = m[13], m34 = m[14], m44 = m[15];

    r[0] = m11 * t11 + m12 * t21 + m13 * t31;
    r[1] = m21 * t11 + m22 * t21 + m23 * t31;
    r[2] = m31 * t11 + m32 * t21 + m33 * t31;
    r[3] = m41 * t11 + m42 * t21 + m43 * t31;
    r[4] = m11 * t12 + m12 * t22 + m13 * t32;
    r[5] = m21 * t12 + m22 * t22 + m23 * t32;
    r[6] = m31 * t12 + m32 * t22 + m33 * t32;
    r[7] = m41 * t12 + m42 * t22 + m43 * t32;
    r[8] = m11 * t13 + m12 * t23 + m13 * t33;
    r[9] = m21 * t13 + m22 * t23 + m23 * t33;
    r[10] = m31 * t13 + m32 * t23 + m33 * t33;
    r[11] = m41 * t13 + m42 * t23 + m43 * t33;
    r[12] = m14,
    r[13] = m24;
    r[14] = m34;
    r[15] = m44;

    return r;
});

function _MJS_m4x4makeScale3Local(x, y, z) {
    var r = new Float64Array(16);

    r[0] = x;
    r[1] = 0;
    r[2] = 0;
    r[3] = 0;
    r[4] = 0;
    r[5] = y;
    r[6] = 0;
    r[7] = 0;
    r[8] = 0;
    r[9] = 0;
    r[10] = z;
    r[11] = 0;
    r[12] = 0;
    r[13] = 0;
    r[14] = 0;
    r[15] = 1;

    return r;
}
var _MJS_m4x4makeScale3 = F3(_MJS_m4x4makeScale3Local);

var _MJS_m4x4makeScale = function(v) {
    return _MJS_m4x4makeScale3Local(v[0], v[1], v[2]);
};

var _MJS_m4x4scale3 = F4(function(x, y, z, m) {
    var r = new Float64Array(16);

    r[0] = m[0] * x;
    r[1] = m[1] * x;
    r[2] = m[2] * x;
    r[3] = m[3] * x;
    r[4] = m[4] * y;
    r[5] = m[5] * y;
    r[6] = m[6] * y;
    r[7] = m[7] * y;
    r[8] = m[8] * z;
    r[9] = m[9] * z;
    r[10] = m[10] * z;
    r[11] = m[11] * z;
    r[12] = m[12];
    r[13] = m[13];
    r[14] = m[14];
    r[15] = m[15];

    return r;
});

var _MJS_m4x4scale = F2(function(v, m) {
    var r = new Float64Array(16);
    var x = v[0];
    var y = v[1];
    var z = v[2];

    r[0] = m[0] * x;
    r[1] = m[1] * x;
    r[2] = m[2] * x;
    r[3] = m[3] * x;
    r[4] = m[4] * y;
    r[5] = m[5] * y;
    r[6] = m[6] * y;
    r[7] = m[7] * y;
    r[8] = m[8] * z;
    r[9] = m[9] * z;
    r[10] = m[10] * z;
    r[11] = m[11] * z;
    r[12] = m[12];
    r[13] = m[13];
    r[14] = m[14];
    r[15] = m[15];

    return r;
});

function _MJS_m4x4makeTranslate3Local(x, y, z) {
    var r = new Float64Array(16);

    r[0] = 1;
    r[1] = 0;
    r[2] = 0;
    r[3] = 0;
    r[4] = 0;
    r[5] = 1;
    r[6] = 0;
    r[7] = 0;
    r[8] = 0;
    r[9] = 0;
    r[10] = 1;
    r[11] = 0;
    r[12] = x;
    r[13] = y;
    r[14] = z;
    r[15] = 1;

    return r;
}
var _MJS_m4x4makeTranslate3 = F3(_MJS_m4x4makeTranslate3Local);

var _MJS_m4x4makeTranslate = function(v) {
    return _MJS_m4x4makeTranslate3Local(v[0], v[1], v[2]);
};

var _MJS_m4x4translate3 = F4(function(x, y, z, m) {
    var r = new Float64Array(16);
    var m11 = m[0];
    var m21 = m[1];
    var m31 = m[2];
    var m41 = m[3];
    var m12 = m[4];
    var m22 = m[5];
    var m32 = m[6];
    var m42 = m[7];
    var m13 = m[8];
    var m23 = m[9];
    var m33 = m[10];
    var m43 = m[11];

    r[0] = m11;
    r[1] = m21;
    r[2] = m31;
    r[3] = m41;
    r[4] = m12;
    r[5] = m22;
    r[6] = m32;
    r[7] = m42;
    r[8] = m13;
    r[9] = m23;
    r[10] = m33;
    r[11] = m43;
    r[12] = m11 * x + m12 * y + m13 * z + m[12];
    r[13] = m21 * x + m22 * y + m23 * z + m[13];
    r[14] = m31 * x + m32 * y + m33 * z + m[14];
    r[15] = m41 * x + m42 * y + m43 * z + m[15];

    return r;
});

var _MJS_m4x4translate = F2(function(v, m) {
    var r = new Float64Array(16);
    var x = v[0];
    var y = v[1];
    var z = v[2];
    var m11 = m[0];
    var m21 = m[1];
    var m31 = m[2];
    var m41 = m[3];
    var m12 = m[4];
    var m22 = m[5];
    var m32 = m[6];
    var m42 = m[7];
    var m13 = m[8];
    var m23 = m[9];
    var m33 = m[10];
    var m43 = m[11];

    r[0] = m11;
    r[1] = m21;
    r[2] = m31;
    r[3] = m41;
    r[4] = m12;
    r[5] = m22;
    r[6] = m32;
    r[7] = m42;
    r[8] = m13;
    r[9] = m23;
    r[10] = m33;
    r[11] = m43;
    r[12] = m11 * x + m12 * y + m13 * z + m[12];
    r[13] = m21 * x + m22 * y + m23 * z + m[13];
    r[14] = m31 * x + m32 * y + m33 * z + m[14];
    r[15] = m41 * x + m42 * y + m43 * z + m[15];

    return r;
});

var _MJS_m4x4makeLookAt = F3(function(eye, center, up) {
    var z = _MJS_v3directionLocal(eye, center, _MJS_v3temp1Local);
    var x = _MJS_v3normalizeLocal(_MJS_v3crossLocal(up, z, _MJS_v3temp2Local), _MJS_v3temp2Local);
    var y = _MJS_v3normalizeLocal(_MJS_v3crossLocal(z, x, _MJS_v3temp3Local), _MJS_v3temp3Local);
    var tm1 = _MJS_m4x4temp1Local;
    var tm2 = _MJS_m4x4temp2Local;

    tm1[0] = x[0];
    tm1[1] = y[0];
    tm1[2] = z[0];
    tm1[3] = 0;
    tm1[4] = x[1];
    tm1[5] = y[1];
    tm1[6] = z[1];
    tm1[7] = 0;
    tm1[8] = x[2];
    tm1[9] = y[2];
    tm1[10] = z[2];
    tm1[11] = 0;
    tm1[12] = 0;
    tm1[13] = 0;
    tm1[14] = 0;
    tm1[15] = 1;

    tm2[0] = 1; tm2[1] = 0; tm2[2] = 0; tm2[3] = 0;
    tm2[4] = 0; tm2[5] = 1; tm2[6] = 0; tm2[7] = 0;
    tm2[8] = 0; tm2[9] = 0; tm2[10] = 1; tm2[11] = 0;
    tm2[12] = -eye[0]; tm2[13] = -eye[1]; tm2[14] = -eye[2]; tm2[15] = 1;

    return _MJS_m4x4mulLocal(tm1, tm2);
});


function _MJS_m4x4transposeLocal(m) {
    var r = new Float64Array(16);

    r[0] = m[0]; r[1] = m[4]; r[2] = m[8]; r[3] = m[12];
    r[4] = m[1]; r[5] = m[5]; r[6] = m[9]; r[7] = m[13];
    r[8] = m[2]; r[9] = m[6]; r[10] = m[10]; r[11] = m[14];
    r[12] = m[3]; r[13] = m[7]; r[14] = m[11]; r[15] = m[15];

    return r;
}
var _MJS_m4x4transpose = _MJS_m4x4transposeLocal;

var _MJS_m4x4makeBasis = F3(function(vx, vy, vz) {
    var r = new Float64Array(16);

    r[0] = vx[0];
    r[1] = vx[1];
    r[2] = vx[2];
    r[3] = 0;
    r[4] = vy[0];
    r[5] = vy[1];
    r[6] = vy[2];
    r[7] = 0;
    r[8] = vz[0];
    r[9] = vz[1];
    r[10] = vz[2];
    r[11] = 0;
    r[12] = 0;
    r[13] = 0;
    r[14] = 0;
    r[15] = 1;

    return r;
});



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return word
		? elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? elm$core$Maybe$Nothing
		: elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? elm$core$Maybe$Just(n) : elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




/**/
function _Json_errorToString(error)
{
	return elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? elm$core$Result$Ok(value)
		: (value instanceof String)
			? elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return elm$core$Result$Err(A2(elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return (elm$core$Result$isOk(result)) ? result : elm$core$Result$Err(A2(elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return (elm$core$Result$isOk(result)) ? result : elm$core$Result$Err(A2(elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!elm$core$Result$isOk(result))
					{
						return elm$core$Result$Err(A2(elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return elm$core$Result$Ok(elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if (elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return elm$core$Result$Err(elm$json$Json$Decode$OneOf(elm$core$List$reverse(errors)));

		case 1:
			return elm$core$Result$Err(A2(elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!elm$core$Result$isOk(result))
		{
			return elm$core$Result$Err(A2(elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList === 'function' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2(elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return elm$core$Result$Err(A2(elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap(value) { return { $: 0, a: value }; }
function _Json_unwrap(value) { return value.a; }

function _Json_wrap_UNUSED(value) { return value; }
function _Json_unwrap_UNUSED(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	elm$core$Result$isOk(result) || _Debug_crash(2 /**/, _Json_errorToString(result.a) /**/);
	var managers = {};
	result = init(result.a);
	var model = result.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		result = A2(update, msg, model);
		stepper(model = result.a, viewMetadata);
		_Platform_dispatchEffects(managers, result.b, subscriptions(model));
	}

	_Platform_dispatchEffects(managers, result.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				p: bag.n,
				q: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.q)
		{
			x = temp.p(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		r: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].r;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		r: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].r;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}



function _Time_now(millisToPosix)
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(millisToPosix(Date.now())));
	});
}

var _Time_setInterval = F2(function(interval, task)
{
	return _Scheduler_binding(function(callback)
	{
		var id = setInterval(function() { _Scheduler_rawSpawn(task); }, interval);
		return function() { clearInterval(id); };
	});
});

function _Time_here()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(
			A2(elm$time$Time$customZone, -(new Date().getTimezoneOffset()), _List_Nil)
		));
	});
}


function _Time_getZoneName()
{
	return _Scheduler_binding(function(callback)
	{
		try
		{
			var name = elm$time$Time$Name(Intl.DateTimeFormat().resolvedOptions().timeZone);
		}
		catch (e)
		{
			var name = elm$time$Time$Offset(new Date().getTimezoneOffset());
		}
		callback(_Scheduler_succeed(name));
	});
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**_UNUSED/
	var node = args['node'];
	//*/
	/**/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS


function _VirtualDom_noScript(tag)
{
	return tag == 'script' ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return /^(on|formAction$)/i.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri_UNUSED(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,'')) ? '' : value;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,''))
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri_UNUSED(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value) ? '' : value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value)
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2(elm$json$Json$Decode$map, func, handler.a)
				:
			A3(elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		message: func(record.message),
		stopPropagation: record.stopPropagation,
		preventDefault: record.preventDefault
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.message;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.stopPropagation;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.preventDefault) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var view = impl.view;
			/**_UNUSED/
			var domNode = args['node'];
			//*/
			/**/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.setup && impl.setup(sendToApp)
			var view = impl.view;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.body);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.title) && (_VirtualDom_doc.title = title = doc.title);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.onUrlChange;
	var onUrlRequest = impl.onUrlRequest;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		setup: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.protocol === next.protocol
							&& curr.host === next.host
							&& curr.port_.a === next.port_.a
						)
							? elm$browser$Browser$Internal(next)
							: elm$browser$Browser$External(href)
					));
				}
			});
		},
		init: function(flags)
		{
			return A3(impl.init, flags, _Browser_getUrl(), key);
		},
		view: impl.view,
		update: impl.update,
		subscriptions: impl.subscriptions
	});
}

function _Browser_getUrl()
{
	return elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2(elm$core$Task$perform, elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2(elm$core$Task$perform, elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2(elm$core$Task$perform, elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return elm$core$Result$isOk(result) ? elm$core$Maybe$Just(result.a) : elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { hidden: 'hidden', change: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { hidden: 'mozHidden', change: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { hidden: 'msHidden', change: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { hidden: 'webkitHidden', change: 'webkitvisibilitychange' }
		: { hidden: 'hidden', change: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail(elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		scene: _Browser_getScene(),
		viewport: {
			x: _Browser_window.pageXOffset,
			y: _Browser_window.pageYOffset,
			width: _Browser_doc.documentElement.clientWidth,
			height: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		width: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		height: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			scene: {
				width: node.scrollWidth,
				height: node.scrollHeight
			},
			viewport: {
				x: node.scrollLeft,
				y: node.scrollTop,
				width: node.clientWidth,
				height: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			scene: _Browser_getScene(),
			viewport: {
				x: x,
				y: y,
				width: _Browser_doc.documentElement.clientWidth,
				height: _Browser_doc.documentElement.clientHeight
			},
			element: {
				x: x + rect.left,
				y: y + rect.top,
				width: rect.width,
				height: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2(elm$core$Task$perform, elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2(elm$core$Task$perform, elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}



var _Bitwise_and = F2(function(a, b)
{
	return a & b;
});

var _Bitwise_or = F2(function(a, b)
{
	return a | b;
});

var _Bitwise_xor = F2(function(a, b)
{
	return a ^ b;
});

function _Bitwise_complement(a)
{
	return ~a;
};

var _Bitwise_shiftLeftBy = F2(function(offset, a)
{
	return a << offset;
});

var _Bitwise_shiftRightBy = F2(function(offset, a)
{
	return a >> offset;
});

var _Bitwise_shiftRightZfBy = F2(function(offset, a)
{
	return a >>> offset;
});


function _Url_percentEncode(string)
{
	return encodeURIComponent(string);
}

function _Url_percentDecode(string)
{
	try
	{
		return elm$core$Maybe$Just(decodeURIComponent(string));
	}
	catch (e)
	{
		return elm$core$Maybe$Nothing;
	}
}var author$project$Main$NoJs = function (a) {
	return {$: 'NoJs', a: a};
};
var author$project$Main$SetCurrentDate = function (a) {
	return {$: 'SetCurrentDate', a: a};
};
var elm$core$Basics$EQ = {$: 'EQ'};
var elm$core$Basics$LT = {$: 'LT'};
var elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var elm$core$Array$foldr = F3(
	function (func, baseCase, _n0) {
		var tree = _n0.c;
		var tail = _n0.d;
		var helper = F2(
			function (node, acc) {
				if (node.$ === 'SubTree') {
					var subTree = node.a;
					return A3(elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3(elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			elm$core$Elm$JsArray$foldr,
			helper,
			A3(elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var elm$core$List$cons = _List_cons;
var elm$core$Array$toList = function (array) {
	return A3(elm$core$Array$foldr, elm$core$List$cons, _List_Nil, array);
};
var elm$core$Basics$GT = {$: 'GT'};
var elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3(elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var elm$core$Dict$toList = function (dict) {
	return A3(
		elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var elm$core$Dict$keys = function (dict) {
	return A3(
		elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2(elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var elm$core$Set$toList = function (_n0) {
	var dict = _n0.a;
	return elm$core$Dict$keys(dict);
};
var elm$core$Maybe$Just = function (a) {
	return {$: 'Just', a: a};
};
var elm$core$Maybe$Nothing = {$: 'Nothing'};
var elm_explorations$linear_algebra$Math$Vector3$getX = _MJS_v3getX;
var elm_explorations$linear_algebra$Math$Vector3$getY = _MJS_v3getY;
var elm_explorations$linear_algebra$Math$Vector3$getZ = _MJS_v3getZ;
var author$project$CoordinatesTransform$toList = function (coordinatesTransform) {
	return _List_fromArray(
		[
			elm_explorations$linear_algebra$Math$Vector3$getX(coordinatesTransform.x),
			elm_explorations$linear_algebra$Math$Vector3$getX(coordinatesTransform.y),
			elm_explorations$linear_algebra$Math$Vector3$getX(coordinatesTransform.z),
			elm_explorations$linear_algebra$Math$Vector3$getY(coordinatesTransform.x),
			elm_explorations$linear_algebra$Math$Vector3$getY(coordinatesTransform.y),
			elm_explorations$linear_algebra$Math$Vector3$getY(coordinatesTransform.z),
			elm_explorations$linear_algebra$Math$Vector3$getZ(coordinatesTransform.x),
			elm_explorations$linear_algebra$Math$Vector3$getZ(coordinatesTransform.y),
			elm_explorations$linear_algebra$Math$Vector3$getZ(coordinatesTransform.z)
		]);
};
var elm$core$Array$branchFactor = 32;
var elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 'Array_elm_builtin', a: a, b: b, c: c, d: d};
	});
var elm$core$Basics$ceiling = _Basics_ceiling;
var elm$core$Basics$fdiv = _Basics_fdiv;
var elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var elm$core$Basics$toFloat = _Basics_toFloat;
var elm$core$Array$shiftStep = elm$core$Basics$ceiling(
	A2(elm$core$Basics$logBase, 2, elm$core$Array$branchFactor));
var elm$core$Elm$JsArray$empty = _JsArray_empty;
var elm$core$Array$empty = A4(elm$core$Array$Array_elm_builtin, 0, elm$core$Array$shiftStep, elm$core$Elm$JsArray$empty, elm$core$Elm$JsArray$empty);
var elm$core$Array$Leaf = function (a) {
	return {$: 'Leaf', a: a};
};
var elm$core$Array$SubTree = function (a) {
	return {$: 'SubTree', a: a};
};
var elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var elm$core$List$reverse = function (list) {
	return A3(elm$core$List$foldl, elm$core$List$cons, _List_Nil, list);
};
var elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _n0 = A2(elm$core$Elm$JsArray$initializeFromList, elm$core$Array$branchFactor, nodes);
			var node = _n0.a;
			var remainingNodes = _n0.b;
			var newAcc = A2(
				elm$core$List$cons,
				elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var elm$core$Basics$eq = _Utils_equal;
var elm$core$Tuple$first = function (_n0) {
	var x = _n0.a;
	return x;
};
var elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = elm$core$Basics$ceiling(nodeListSize / elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2(elm$core$Elm$JsArray$initializeFromList, elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2(elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var elm$core$Basics$add = _Basics_add;
var elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var elm$core$Basics$floor = _Basics_floor;
var elm$core$Basics$gt = _Utils_gt;
var elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var elm$core$Basics$mul = _Basics_mul;
var elm$core$Basics$sub = _Basics_sub;
var elm$core$Elm$JsArray$length = _JsArray_length;
var elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.nodeListSize) {
			return A4(
				elm$core$Array$Array_elm_builtin,
				elm$core$Elm$JsArray$length(builder.tail),
				elm$core$Array$shiftStep,
				elm$core$Elm$JsArray$empty,
				builder.tail);
		} else {
			var treeLen = builder.nodeListSize * elm$core$Array$branchFactor;
			var depth = elm$core$Basics$floor(
				A2(elm$core$Basics$logBase, elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? elm$core$List$reverse(builder.nodeList) : builder.nodeList;
			var tree = A2(elm$core$Array$treeFromBuilder, correctNodeList, builder.nodeListSize);
			return A4(
				elm$core$Array$Array_elm_builtin,
				elm$core$Elm$JsArray$length(builder.tail) + treeLen,
				A2(elm$core$Basics$max, 5, depth * elm$core$Array$shiftStep),
				tree,
				builder.tail);
		}
	});
var elm$core$Basics$False = {$: 'False'};
var elm$core$Basics$idiv = _Basics_idiv;
var elm$core$Basics$lt = _Utils_lt;
var elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					elm$core$Array$builderToArray,
					false,
					{nodeList: nodeList, nodeListSize: (len / elm$core$Array$branchFactor) | 0, tail: tail});
			} else {
				var leaf = elm$core$Array$Leaf(
					A3(elm$core$Elm$JsArray$initialize, elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2(elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var elm$core$Basics$le = _Utils_le;
var elm$core$Basics$remainderBy = _Basics_remainderBy;
var elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return elm$core$Array$empty;
		} else {
			var tailLen = len % elm$core$Array$branchFactor;
			var tail = A3(elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - elm$core$Array$branchFactor;
			return A5(elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var elm$core$Result$Err = function (a) {
	return {$: 'Err', a: a};
};
var elm$core$Result$Ok = function (a) {
	return {$: 'Ok', a: a};
};
var elm$core$Basics$True = {$: 'True'};
var elm$core$Result$isOk = function (result) {
	if (result.$ === 'Ok') {
		return true;
	} else {
		return false;
	}
};
var elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 'Failure', a: a, b: b};
	});
var elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 'Field', a: a, b: b};
	});
var elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 'Index', a: a, b: b};
	});
var elm$json$Json$Decode$OneOf = function (a) {
	return {$: 'OneOf', a: a};
};
var elm$core$Basics$and = _Basics_and;
var elm$core$Basics$append = _Utils_append;
var elm$core$Basics$or = _Basics_or;
var elm$core$Char$toCode = _Char_toCode;
var elm$core$Char$isLower = function (_char) {
	var code = elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var elm$core$Char$isUpper = function (_char) {
	var code = elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var elm$core$Char$isAlpha = function (_char) {
	return elm$core$Char$isLower(_char) || elm$core$Char$isUpper(_char);
};
var elm$core$Char$isDigit = function (_char) {
	var code = elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var elm$core$Char$isAlphaNum = function (_char) {
	return elm$core$Char$isLower(_char) || (elm$core$Char$isUpper(_char) || elm$core$Char$isDigit(_char));
};
var elm$core$List$length = function (xs) {
	return A3(
		elm$core$List$foldl,
		F2(
			function (_n0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var elm$core$List$map2 = _List_map2;
var elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2(elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var elm$core$List$range = F2(
	function (lo, hi) {
		return A3(elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			elm$core$List$map2,
			f,
			A2(
				elm$core$List$range,
				0,
				elm$core$List$length(xs) - 1),
			xs);
	});
var elm$core$String$all = _String_all;
var elm$core$String$fromInt = _String_fromNumber;
var elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var elm$core$String$uncons = _String_uncons;
var elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var elm$json$Json$Decode$indent = function (str) {
	return A2(
		elm$core$String$join,
		'\n    ',
		A2(elm$core$String$split, '\n', str));
};
var elm$json$Json$Encode$encode = _Json_encode;
var elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + (elm$core$String$fromInt(i + 1) + (') ' + elm$json$Json$Decode$indent(
			elm$json$Json$Decode$errorToString(error))));
	});
var elm$json$Json$Decode$errorToString = function (error) {
	return A2(elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 'Field':
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _n1 = elm$core$String$uncons(f);
						if (_n1.$ === 'Nothing') {
							return false;
						} else {
							var _n2 = _n1.a;
							var _char = _n2.a;
							var rest = _n2.b;
							return elm$core$Char$isAlpha(_char) && A2(elm$core$String$all, elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2(elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'Index':
					var i = error.a;
					var err = error.b;
					var indexName = '[' + (elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2(elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'OneOf':
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									elm$core$String$join,
									'',
									elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										elm$core$String$join,
										'',
										elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + (elm$core$String$fromInt(
								elm$core$List$length(errors)) + ' ways:'));
							return A2(
								elm$core$String$join,
								'\n\n',
								A2(
									elm$core$List$cons,
									introduction,
									A2(elm$core$List$indexedMap, elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								elm$core$String$join,
								'',
								elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + (elm$json$Json$Decode$indent(
						A2(elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var elm$json$Json$Encode$float = _Json_wrap;
var elm$json$Json$Encode$list = F2(
	function (func, entries) {
		return _Json_wrap(
			A3(
				elm$core$List$foldl,
				_Json_addEntry(func),
				_Json_emptyArray(_Utils_Tuple0),
				entries));
	});
var author$project$CoordinatesTransform$encode = function (coordinatesTransform) {
	return A2(
		elm$json$Json$Encode$list,
		elm$json$Json$Encode$float,
		author$project$CoordinatesTransform$toList(coordinatesTransform));
};
var elm$core$Basics$ge = _Utils_ge;
var elm$core$Basics$negate = function (n) {
	return -n;
};
var elm$core$Dict$RBEmpty_elm_builtin = {$: 'RBEmpty_elm_builtin'};
var elm$core$Dict$empty = elm$core$Dict$RBEmpty_elm_builtin;
var elm$core$Dict$foldl = F3(
	function (func, acc, dict) {
		foldl:
		while (true) {
			if (dict.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3(elm$core$Dict$foldl, func, acc, left)),
					$temp$dict = right;
				func = $temp$func;
				acc = $temp$acc;
				dict = $temp$dict;
				continue foldl;
			}
		}
	});
var elm$core$Dict$Black = {$: 'Black'};
var elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: 'RBNode_elm_builtin', a: a, b: b, c: c, d: d, e: e};
	});
var elm$core$Basics$compare = _Utils_compare;
var elm$core$Dict$Red = {$: 'Red'};
var elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === 'RBNode_elm_builtin') && (right.a.$ === 'Red')) {
			var _n1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) {
				var _n3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					elm$core$Dict$RBNode_elm_builtin,
					elm$core$Dict$Red,
					key,
					value,
					A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Black, lK, lV, lLeft, lRight),
					A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Black, rK, rV, rLeft, rRight));
			} else {
				return A5(
					elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Red, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) && (left.d.$ === 'RBNode_elm_builtin')) && (left.d.a.$ === 'Red')) {
				var _n5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _n6 = left.d;
				var _n7 = _n6.a;
				var llK = _n6.b;
				var llV = _n6.c;
				var llLeft = _n6.d;
				var llRight = _n6.e;
				var lRight = left.e;
				return A5(
					elm$core$Dict$RBNode_elm_builtin,
					elm$core$Dict$Red,
					lK,
					lV,
					A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Black, llK, llV, llLeft, llRight),
					A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Black, key, value, lRight, right));
			} else {
				return A5(elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Red, key, value, elm$core$Dict$RBEmpty_elm_builtin, elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _n1 = A2(elm$core$Basics$compare, key, nKey);
			switch (_n1.$) {
				case 'LT':
					return A5(
						elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3(elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 'EQ':
					return A5(elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3(elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _n0 = A3(elm$core$Dict$insertHelp, key, value, dict);
		if ((_n0.$ === 'RBNode_elm_builtin') && (_n0.a.$ === 'Red')) {
			var _n1 = _n0.a;
			var k = _n0.b;
			var v = _n0.c;
			var l = _n0.d;
			var r = _n0.e;
			return A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Black, k, v, l, r);
		} else {
			var x = _n0;
			return x;
		}
	});
var elm$core$Dict$filter = F2(
	function (isGood, dict) {
		return A3(
			elm$core$Dict$foldl,
			F3(
				function (k, v, d) {
					return A2(isGood, k, v) ? A3(elm$core$Dict$insert, k, v, d) : d;
				}),
			elm$core$Dict$empty,
			dict);
	});
var elm$core$Dict$sizeHelp = F2(
	function (n, dict) {
		sizeHelp:
		while (true) {
			if (dict.$ === 'RBEmpty_elm_builtin') {
				return n;
			} else {
				var left = dict.d;
				var right = dict.e;
				var $temp$n = A2(elm$core$Dict$sizeHelp, n + 1, right),
					$temp$dict = left;
				n = $temp$n;
				dict = $temp$dict;
				continue sizeHelp;
			}
		}
	});
var elm$core$Dict$size = function (dict) {
	return A2(elm$core$Dict$sizeHelp, 0, dict);
};
var author$project$Main$getPartitionOffset = F2(
	function (partitionSummary, index) {
		var total = function (exceptions_) {
			return A3(
				elm$core$Dict$foldl,
				F3(
					function (_n1, value, currentTotal) {
						return currentTotal + value.value;
					}),
				0.0,
				exceptions_);
		};
		var number = index - partitionSummary.zero.index;
		var exceptionsToAccountFor = F2(
			function (minKey, maxKey) {
				return A2(
					elm$core$Dict$filter,
					F2(
						function (key, _n0) {
							return (_Utils_cmp(key, maxKey + partitionSummary.zero.index) < 0) && (_Utils_cmp(key, minKey + partitionSummary.zero.index) > -1);
						}),
					partitionSummary.spacingExceptions);
			});
		var exceptions = (number > 0) ? A2(exceptionsToAccountFor, 0, number) : A2(exceptionsToAccountFor, number, 0);
		return (number > 0) ? (total(exceptions) + (partitionSummary.spacing.value * (number - elm$core$Dict$size(exceptions)))) : ((number < 0) ? ((-1) * (total(exceptions) + (partitionSummary.spacing.value * (((-1) * number) - elm$core$Dict$size(exceptions))))) : 0);
	});
var elm$core$List$repeatHelp = F3(
	function (result, n, value) {
		repeatHelp:
		while (true) {
			if (n <= 0) {
				return result;
			} else {
				var $temp$result = A2(elm$core$List$cons, value, result),
					$temp$n = n - 1,
					$temp$value = value;
				result = $temp$result;
				n = $temp$n;
				value = $temp$value;
				continue repeatHelp;
			}
		}
	});
var elm$core$List$repeat = F2(
	function (n, value) {
		return A3(elm$core$List$repeatHelp, _List_Nil, n, value);
	});
var author$project$Main$computeBulkheads = function (bulkheads) {
	var initialBulkheadList = A2(
		elm$core$List$repeat,
		bulkheads.number.value,
		{index: 0, number: 0, position: 0.0});
	var computeBulkhead = F2(
		function (index, _n0) {
			var number = index - bulkheads.zero.index;
			return {
				index: index,
				number: number,
				position: bulkheads.zero.position.value + A2(author$project$Main$getPartitionOffset, bulkheads, index)
			};
		});
	return A2(elm$core$List$indexedMap, computeBulkhead, initialBulkheadList);
};
var author$project$Main$computeDecks = function (decks) {
	var initialDeckList = A2(
		elm$core$List$repeat,
		decks.number.value,
		{index: 0, number: 0, position: 0.0});
	var computeDeck = F2(
		function (index, _n0) {
			var number = index - decks.zero.index;
			return {
				index: index,
				number: number,
				position: decks.zero.position.value - (1 * A2(author$project$Main$getPartitionOffset, decks, index))
			};
		});
	return A2(elm$core$List$indexedMap, computeDeck, initialDeckList);
};
var elm$json$Json$Encode$int = _Json_wrap;
var elm$json$Json$Encode$object = function (pairs) {
	return _Json_wrap(
		A3(
			elm$core$List$foldl,
			F2(
				function (_n0, obj) {
					var k = _n0.a;
					var v = _n0.b;
					return A3(_Json_addField, k, v, obj);
				}),
			_Json_emptyObject(_Utils_Tuple0),
			pairs));
};
var author$project$Main$encodeComputedPartition = function (computedDeck) {
	return elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'index',
				elm$json$Json$Encode$int(computedDeck.index)),
				_Utils_Tuple2(
				'position',
				elm$json$Json$Encode$float(computedDeck.position)),
				_Utils_Tuple2(
				'number',
				elm$json$Json$Encode$int(computedDeck.number))
			]));
};
var author$project$Main$encodeComputedPartitions = function (computedPartitions) {
	return A2(elm$json$Json$Encode$list, author$project$Main$encodeComputedPartition, computedPartitions);
};
var elm$json$Json$Encode$string = _Json_wrap;
var author$project$Main$encodeViewMode = function (viewMode) {
	return elm$json$Json$Encode$string(
		function () {
			switch (viewMode.$) {
				case 'SpaceReservation':
					return 'block';
				case 'Hull':
					return 'library';
				case 'Partitioning':
					return 'partition';
				default:
					return 'kpi';
			}
		}());
};
var author$project$Viewports$cameraTypeToString = function (cameraType) {
	if (cameraType.$ === 'Orthographic') {
		return 'Orthographic';
	} else {
		return 'Perspective';
	}
};
var elm$json$Json$Encode$bool = _Json_wrap;
var author$project$Viewports$encodeCanControl = function (canControl) {
	return elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'x',
				elm$json$Json$Encode$bool(canControl.x)),
				_Utils_Tuple2(
				'y',
				elm$json$Json$Encode$bool(canControl.y)),
				_Utils_Tuple2(
				'z',
				elm$json$Json$Encode$bool(canControl.z))
			]));
};
var avh4$elm_color$Color$toRgba = function (_n0) {
	var r = _n0.a;
	var g = _n0.b;
	var b = _n0.c;
	var a = _n0.d;
	return {alpha: a, blue: b, green: g, red: r};
};
var author$project$Viewports$encodeColor = function (color) {
	var rgb = avh4$elm_color$Color$toRgba(color);
	return elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'red',
				elm$json$Json$Encode$int(
					elm$core$Basics$floor(0.5 + (255 * rgb.red)))),
				_Utils_Tuple2(
				'green',
				elm$json$Json$Encode$int(
					elm$core$Basics$floor(0.5 + (255 * rgb.green)))),
				_Utils_Tuple2(
				'blue',
				elm$json$Json$Encode$int(
					elm$core$Basics$floor(0.5 + (255 * rgb.blue)))),
				_Utils_Tuple2(
				'alpha',
				elm$json$Json$Encode$float(rgb.alpha))
			]));
};
var elm_explorations$linear_algebra$Math$Vector3$toRecord = _MJS_v3toRecord;
var author$project$Viewports$encodeVector3 = function (vector) {
	var record = elm_explorations$linear_algebra$Math$Vector3$toRecord(vector);
	return elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'x',
				elm$json$Json$Encode$float(record.x)),
				_Utils_Tuple2(
				'y',
				elm$json$Json$Encode$float(record.y)),
				_Utils_Tuple2(
				'z',
				elm$json$Json$Encode$float(record.z))
			]));
};
var author$project$Viewports$encodeViewport = function (viewport) {
	return elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'label',
				elm$json$Json$Encode$string(viewport.label)),
				_Utils_Tuple2(
				'left',
				elm$json$Json$Encode$float(viewport.left)),
				_Utils_Tuple2(
				'top',
				elm$json$Json$Encode$float(viewport.top)),
				_Utils_Tuple2(
				'width',
				elm$json$Json$Encode$float(viewport.width)),
				_Utils_Tuple2(
				'height',
				elm$json$Json$Encode$float(viewport.height)),
				_Utils_Tuple2(
				'background',
				author$project$Viewports$encodeColor(viewport.background)),
				_Utils_Tuple2(
				'eye',
				author$project$Viewports$encodeVector3(viewport.eye)),
				_Utils_Tuple2(
				'canControl',
				author$project$Viewports$encodeCanControl(viewport.canControl)),
				_Utils_Tuple2(
				'cameraType',
				elm$json$Json$Encode$string(
					author$project$Viewports$cameraTypeToString(viewport.cameraType)))
			]));
};
var author$project$Viewports$encodeViewports = function (viewports) {
	return A2(elm$json$Json$Encode$list, author$project$Viewports$encodeViewport, viewports);
};
var author$project$Main$encodeInitThreeCommand = function (model) {
	return elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'viewports',
				author$project$Viewports$encodeViewports(model.viewports)),
				_Utils_Tuple2(
				'coordinatesTransform',
				author$project$CoordinatesTransform$encode(model.coordinatesTransform)),
				_Utils_Tuple2(
				'mode',
				author$project$Main$encodeViewMode(model.viewMode)),
				_Utils_Tuple2(
				'showingPartitions',
				elm$json$Json$Encode$bool(model.partitions.showing)),
				_Utils_Tuple2(
				'decks',
				author$project$Main$encodeComputedPartitions(
					author$project$Main$computeDecks(model.partitions.decks))),
				_Utils_Tuple2(
				'bulkheads',
				author$project$Main$encodeComputedPartitions(
					author$project$Main$computeBulkheads(model.partitions.bulkheads)))
			]));
};
var author$project$Main$initCmd = function (model) {
	return {
		data: author$project$Main$encodeInitThreeCommand(model),
		tag: 'init-three'
	};
};
var author$project$CoordinatesTransform$fromVectors = F3(
	function (x, y, z) {
		return {x: x, y: y, z: z};
	});
var elm_explorations$linear_algebra$Math$Vector3$vec3 = _MJS_v3;
var author$project$CoordinatesTransform$default = A3(
	author$project$CoordinatesTransform$fromVectors,
	A3(elm_explorations$linear_algebra$Math$Vector3$vec3, 1, 0, 0),
	A3(elm_explorations$linear_algebra$Math$Vector3$vec3, 0, 0, -1),
	A3(elm_explorations$linear_algebra$Math$Vector3$vec3, 0, 1, 0));
var author$project$AllDictList$AllDictList = F2(
	function (a, b) {
		return {$: 'AllDictList', a: a, b: b};
	});
var author$project$Dict$Any$AnyDict = function (a) {
	return {$: 'AnyDict', a: a};
};
var elm$core$Basics$identity = function (x) {
	return x;
};
var author$project$Dict$Any$empty = function (toKey) {
	return author$project$Dict$Any$AnyDict(
		{dict: elm$core$Dict$empty, toKey: toKey});
};
var author$project$AllDictList$empty = function (ord) {
	return A2(
		author$project$AllDictList$AllDictList,
		author$project$Dict$Any$empty(ord),
		_List_Nil);
};
var author$project$DictList$empty = author$project$AllDictList$empty(elm$core$Basics$identity);
var elm$json$Json$Decode$map2 = _Json_map2;
var NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom = elm$json$Json$Decode$map2(elm$core$Basics$apR);
var elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var elm$json$Json$Decode$succeed = _Json_succeed;
var NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$hardcoded = A2(elm$core$Basics$composeR, elm$json$Json$Decode$succeed, NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom);
var elm$json$Json$Decode$andThen = _Json_andThen;
var elm$json$Json$Decode$decodeValue = _Json_run;
var elm$json$Json$Decode$fail = _Json_fail;
var elm$json$Json$Decode$null = _Json_decodeNull;
var elm$json$Json$Decode$oneOf = _Json_oneOf;
var elm$json$Json$Decode$value = _Json_decodeValue;
var NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optionalDecoder = F3(
	function (pathDecoder, valDecoder, fallback) {
		var nullOr = function (decoder) {
			return elm$json$Json$Decode$oneOf(
				_List_fromArray(
					[
						decoder,
						elm$json$Json$Decode$null(fallback)
					]));
		};
		var handleResult = function (input) {
			var _n0 = A2(elm$json$Json$Decode$decodeValue, pathDecoder, input);
			if (_n0.$ === 'Ok') {
				var rawValue = _n0.a;
				var _n1 = A2(
					elm$json$Json$Decode$decodeValue,
					nullOr(valDecoder),
					rawValue);
				if (_n1.$ === 'Ok') {
					var finalResult = _n1.a;
					return elm$json$Json$Decode$succeed(finalResult);
				} else {
					var finalErr = _n1.a;
					return elm$json$Json$Decode$fail(
						elm$json$Json$Decode$errorToString(finalErr));
				}
			} else {
				return elm$json$Json$Decode$succeed(fallback);
			}
		};
		return A2(elm$json$Json$Decode$andThen, handleResult, elm$json$Json$Decode$value);
	});
var elm$json$Json$Decode$field = _Json_decodeField;
var NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional = F4(
	function (key, valDecoder, fallback, decoder) {
		return A2(
			NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom,
			A3(
				NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optionalDecoder,
				A2(elm$json$Json$Decode$field, key, elm$json$Json$Decode$value),
				valDecoder,
				fallback),
			decoder);
	});
var NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required = F3(
	function (key, valDecoder, decoder) {
		return A2(
			NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom,
			A2(elm$json$Json$Decode$field, key, valDecoder),
			decoder);
	});
var author$project$EncodersDecoders$PreloadedHullSlicesData = F6(
	function (length, breadth, depth, draught, slices, custom) {
		return {breadth: breadth, custom: custom, depth: depth, draught: draught, length: length, slices: slices};
	});
var author$project$HullSlices$CustomHullProperties = F5(
	function (length, breadth, depth, draught, hullslicesPositions) {
		return {breadth: breadth, depth: depth, draught: draught, hullslicesPositions: hullslicesPositions, length: length};
	});
var elm$core$Basics$pow = _Basics_pow;
var author$project$StringValueInput$round_n = F2(
	function (nb_of_digits, x) {
		var factor = A2(elm$core$Basics$pow, 10, nb_of_digits);
		return function (u) {
			return u / factor;
		}(
			elm$core$Basics$floor((factor * x) + 0.5));
	});
var elm$core$String$fromFloat = _String_fromNumber;
var author$project$StringValueInput$fromNumberToMaybe = F4(
	function (unit, description, nbOfDigits, value) {
		var roundedValue = A2(author$project$StringValueInput$round_n, nbOfDigits, value);
		return elm$core$Maybe$Just(
			{
				description: description,
				nbOfDigits: nbOfDigits,
				string: elm$core$String$fromFloat(roundedValue),
				unit: unit,
				value: roundedValue
			});
	});
var elm$json$Json$Decode$float = _Json_decodeFloat;
var elm$json$Json$Decode$list = _Json_decodeList;
var elm$json$Json$Decode$map = _Json_map1;
var author$project$EncodersDecoders$decodeCustomHullProperties = A4(
	NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
	'hullslicesPositions',
	A2(
		elm$json$Json$Decode$map,
		elm$core$Maybe$Just,
		elm$json$Json$Decode$list(elm$json$Json$Decode$float)),
	elm$core$Maybe$Nothing,
	A4(
		NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
		'draught',
		A2(
			elm$json$Json$Decode$map,
			A3(author$project$StringValueInput$fromNumberToMaybe, 'm', 'Draught', 1),
			elm$json$Json$Decode$float),
		elm$core$Maybe$Nothing,
		A4(
			NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
			'depth',
			A2(
				elm$json$Json$Decode$map,
				A3(author$project$StringValueInput$fromNumberToMaybe, 'm', 'Depth', 1),
				elm$json$Json$Decode$float),
			elm$core$Maybe$Nothing,
			A4(
				NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
				'breadth',
				A2(
					elm$json$Json$Decode$map,
					A3(author$project$StringValueInput$fromNumberToMaybe, 'm', 'Breadth', 1),
					elm$json$Json$Decode$float),
				elm$core$Maybe$Nothing,
				A4(
					NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
					'length',
					A2(
						elm$json$Json$Decode$map,
						A3(author$project$StringValueInput$fromNumberToMaybe, 'm', 'Length over all', 1),
						elm$json$Json$Decode$float),
					elm$core$Maybe$Nothing,
					elm$json$Json$Decode$succeed(author$project$HullSlices$CustomHullProperties))))));
var author$project$HullSlices$HullSlice = F4(
	function (x, zmin, zmax, y) {
		return {x: x, y: y, zmax: zmax, zmin: zmin};
	});
var author$project$EncodersDecoders$hullSliceDecoder = A3(
	NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'y',
	elm$json$Json$Decode$list(elm$json$Json$Decode$float),
	A3(
		NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'zmax',
		elm$json$Json$Decode$float,
		A3(
			NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'zmin',
			elm$json$Json$Decode$float,
			A3(
				NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'x',
				elm$json$Json$Decode$float,
				elm$json$Json$Decode$succeed(author$project$HullSlices$HullSlice)))));
var author$project$EncodersDecoders$hullSlicesDecoder = elm$json$Json$Decode$list(author$project$EncodersDecoders$hullSliceDecoder);
var elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return elm$core$Maybe$Just(x);
	} else {
		return elm$core$Maybe$Nothing;
	}
};
var elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							elm$core$List$foldl,
							fn,
							acc,
							elm$core$List$reverse(r4)) : A4(elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4(elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var elm$core$List$tail = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return elm$core$Maybe$Just(xs);
	} else {
		return elm$core$Maybe$Nothing;
	}
};
var elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var author$project$EncodersDecoders$normalizeSlicesPosition = function (slices) {
	var xPositions = A2(
		elm$core$List$map,
		function ($) {
			return $.x;
		},
		slices);
	var xPositionsBetweenFirstAndLast = elm$core$List$reverse(
		A2(
			elm$core$Maybe$withDefault,
			_List_Nil,
			elm$core$List$tail(
				elm$core$List$reverse(
					A2(
						elm$core$Maybe$withDefault,
						_List_Nil,
						elm$core$List$tail(xPositions))))));
	var xLast = A2(
		elm$core$Maybe$withDefault,
		0,
		elm$core$List$head(
			elm$core$List$reverse(xPositions)));
	var xFirst = A2(
		elm$core$Maybe$withDefault,
		0,
		elm$core$List$head(xPositions));
	var xLength = xLast - xFirst;
	var setSlicesPosition = F2(
		function (newX, slice) {
			return _Utils_update(
				slice,
				{x: newX});
		});
	var normalize = function (x) {
		return x / xLength;
	};
	var normalizedSlicesPosition = _Utils_ap(
		_List_fromArray(
			[0]),
		_Utils_ap(
			A2(elm$core$List$map, normalize, xPositionsBetweenFirstAndLast),
			_List_fromArray(
				[1])));
	return A3(elm$core$List$map2, setSlicesPosition, normalizedSlicesPosition, slices);
};
var author$project$StringValueInput$fromNumber = F4(
	function (unit, description, nbOfDigits, value) {
		var roundedValue = A2(author$project$StringValueInput$round_n, nbOfDigits, value);
		return {
			description: description,
			nbOfDigits: nbOfDigits,
			string: elm$core$String$fromFloat(roundedValue),
			unit: unit,
			value: roundedValue
		};
	});
var author$project$HullSlices$emptyHullSlices = {
	breadth: A4(author$project$StringValueInput$fromNumber, 'm', 'Breadth', 1, 0),
	custom: {breadth: elm$core$Maybe$Nothing, depth: elm$core$Maybe$Nothing, draught: elm$core$Maybe$Nothing, hullslicesPositions: elm$core$Maybe$Nothing, length: elm$core$Maybe$Nothing},
	depth: A4(author$project$StringValueInput$fromNumber, 'm', 'Depth', 1, 0),
	draught: A4(author$project$StringValueInput$fromNumber, 'm', 'Draught', 1, 0),
	length: A4(author$project$StringValueInput$fromNumber, 'm', 'Length over all', 1, 0),
	originalSlicePositions: _List_Nil,
	slices: _List_Nil,
	xmin: 0,
	zmin: 0
};
var elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var author$project$EncodersDecoders$decoder = function () {
	var hullSlicesConstructor = F8(
		function (length, breadth, depth, xmin, zmin, slices, draught, custom) {
			return _Utils_update(
				author$project$HullSlices$emptyHullSlices,
				{
					breadth: breadth,
					custom: custom,
					depth: depth,
					draught: draught,
					length: length,
					originalSlicePositions: A2(
						elm$core$List$map,
						function ($) {
							return $.x;
						},
						slices),
					slices: slices,
					xmin: xmin,
					zmin: zmin
				});
		});
	var helper = function (loadedData) {
		var normalizedSlices = author$project$EncodersDecoders$normalizeSlicesPosition(loadedData.slices);
		var draughtDecoded = function () {
			var _n1 = loadedData.draught;
			if (_n1.$ === 'Just') {
				var justDraught = _n1.a;
				return justDraught;
			} else {
				return A4(author$project$StringValueInput$fromNumber, 'm', 'Draught', 1, loadedData.depth.value / 5);
			}
		}();
		var customHullPropertiesDecoded = function () {
			var _n0 = loadedData.custom;
			if (_n0.$ === 'Just') {
				var custom = _n0.a;
				return custom;
			} else {
				return {breadth: elm$core$Maybe$Nothing, depth: elm$core$Maybe$Nothing, draught: elm$core$Maybe$Nothing, hullslicesPositions: elm$core$Maybe$Nothing, length: elm$core$Maybe$Nothing};
			}
		}();
		return A2(
			NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$hardcoded,
			customHullPropertiesDecoded,
			A2(
				NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$hardcoded,
				draughtDecoded,
				A2(
					NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$hardcoded,
					normalizedSlices,
					A3(
						NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
						'zmin',
						elm$json$Json$Decode$float,
						A3(
							NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
							'xmin',
							elm$json$Json$Decode$float,
							A2(
								NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$hardcoded,
								loadedData.depth,
								A2(
									NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$hardcoded,
									loadedData.breadth,
									A2(
										NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$hardcoded,
										loadedData.length,
										elm$json$Json$Decode$succeed(hullSlicesConstructor)))))))));
	};
	return A2(
		elm$json$Json$Decode$andThen,
		helper,
		A4(
			NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
			'custom',
			A2(elm$json$Json$Decode$map, elm$core$Maybe$Just, author$project$EncodersDecoders$decodeCustomHullProperties),
			elm$core$Maybe$Nothing,
			A3(
				NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'slices',
				author$project$EncodersDecoders$hullSlicesDecoder,
				A4(
					NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
					'draught',
					A2(
						elm$json$Json$Decode$map,
						A2(
							elm$core$Basics$composeL,
							elm$core$Maybe$Just,
							A3(author$project$StringValueInput$fromNumber, 'm', 'Draught', 1)),
						elm$json$Json$Decode$float),
					elm$core$Maybe$Nothing,
					A3(
						NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
						'depth',
						A2(
							elm$json$Json$Decode$map,
							A3(author$project$StringValueInput$fromNumber, 'm', 'Depth', 1),
							elm$json$Json$Decode$float),
						A3(
							NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
							'breadth',
							A2(
								elm$json$Json$Decode$map,
								A3(author$project$StringValueInput$fromNumber, 'm', 'Breadth', 1),
								elm$json$Json$Decode$float),
							A3(
								NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
								'length',
								A2(
									elm$json$Json$Decode$map,
									A3(author$project$StringValueInput$fromNumber, 'm', 'Length over all', 1),
									elm$json$Json$Decode$float),
								elm$json$Json$Decode$succeed(author$project$EncodersDecoders$PreloadedHullSlicesData))))))));
}();
var elm$core$Dict$fromList = function (assocs) {
	return A3(
		elm$core$List$foldl,
		F2(
			function (_n0, dict) {
				var key = _n0.a;
				var value = _n0.b;
				return A3(elm$core$Dict$insert, key, value, dict);
			}),
		elm$core$Dict$empty,
		assocs);
};
var elm$json$Json$Decode$keyValuePairs = _Json_decodeKeyValuePairs;
var elm$json$Json$Decode$dict = function (decoder) {
	return A2(
		elm$json$Json$Decode$map,
		elm$core$Dict$fromList,
		elm$json$Json$Decode$keyValuePairs(decoder));
};
var author$project$EncodersDecoders$dictDecoder = elm$json$Json$Decode$dict(author$project$EncodersDecoders$decoder);
var author$project$Main$Hull = function (a) {
	return {$: 'Hull', a: a};
};
var author$project$Main$HullLibrary = {$: 'HullLibrary'};
var author$project$Main$emptyToasts = author$project$DictList$empty;
var author$project$StringValueInput$emptyFloat = function (nbOfDigits) {
	return {description: '', nbOfDigits: nbOfDigits, string: '', unit: '', value: 0};
};
var author$project$StringValueInput$emptyInt = {description: '', string: '', value: 0};
var author$project$Main$initPartitions = {
	bulkheads: {
		number: author$project$StringValueInput$emptyInt,
		spacing: A4(author$project$StringValueInput$fromNumber, 'm', 'Spacing', 1, 5),
		spacingExceptions: elm$core$Dict$empty,
		zero: {
			index: 0,
			position: A4(author$project$StringValueInput$fromNumber, 'm', 'Position of bulckhead zero', 1, 0)
		}
	},
	decks: {
		number: author$project$StringValueInput$emptyInt,
		spacing: A4(author$project$StringValueInput$fromNumber, 'm', 'Spacing', 1, 3.0),
		spacingExceptions: elm$core$Dict$empty,
		zero: {
			index: 0,
			position: author$project$StringValueInput$emptyFloat(1)
		}
	},
	showing: true
};
var author$project$StringValueInput$fromInt = F2(
	function (description, number) {
		return {
			description: description,
			string: elm$core$String$fromInt(number),
			value: number
		};
	});
var author$project$Viewports$bottomLeftCornerViewport = F2(
	function (background, viewport) {
		return A5(viewport, 0, 0.5, 0.5, 0.5, background);
	});
var author$project$Viewports$bottomRightCornerViewport = F2(
	function (background, viewport) {
		return A5(viewport, 0.5, 0.5, 0.5, 0.5, background);
	});
var author$project$Viewports$topLeftCornerViewport = F2(
	function (background, viewport) {
		return A5(viewport, 0, 0, 0.5, 0.5, background);
	});
var author$project$Viewports$topRightCornerViewport = F2(
	function (background, viewport) {
		return A5(viewport, 0.5, 0, 0.5, 0.5, background);
	});
var author$project$Viewports$Orthographic = {$: 'Orthographic'};
var author$project$Viewports$viewportFront = F5(
	function (left, top, width, height, background) {
		return {
			background: background,
			cameraType: author$project$Viewports$Orthographic,
			canControl: {x: false, y: true, z: true},
			eye: A3(elm_explorations$linear_algebra$Math$Vector3$vec3, 1000, 0, 0),
			height: height,
			label: 'Front',
			left: left,
			top: top,
			width: width
		};
	});
var author$project$Viewports$Perspective = {$: 'Perspective'};
var author$project$Viewports$viewportPerspective = F5(
	function (left, top, width, height, background) {
		return {
			background: background,
			cameraType: author$project$Viewports$Perspective,
			canControl: {x: false, y: false, z: false},
			eye: A3(elm_explorations$linear_algebra$Math$Vector3$vec3, 1000, 1000, -1000),
			height: height,
			label: 'Perspective',
			left: left,
			top: top,
			width: width
		};
	});
var author$project$Viewports$viewportSide = F5(
	function (left, top, width, height, background) {
		return {
			background: background,
			cameraType: author$project$Viewports$Orthographic,
			canControl: {x: true, y: false, z: true},
			eye: A3(elm_explorations$linear_algebra$Math$Vector3$vec3, 0, 1000, 0),
			height: height,
			label: 'Side',
			left: left,
			top: top,
			width: width
		};
	});
var author$project$Viewports$viewportTop = F5(
	function (left, top, width, height, background) {
		return {
			background: background,
			cameraType: author$project$Viewports$Orthographic,
			canControl: {x: true, y: true, z: false},
			eye: A3(elm_explorations$linear_algebra$Math$Vector3$vec3, 0, 0, -1000),
			height: height,
			label: 'Top',
			left: left,
			top: top,
			width: width
		};
	});
var avh4$elm_color$Color$RgbaSpace = F4(
	function (a, b, c, d) {
		return {$: 'RgbaSpace', a: a, b: b, c: c, d: d};
	});
var avh4$elm_color$Color$hsla = F4(
	function (hue, sat, light, alpha) {
		var _n0 = _Utils_Tuple3(hue, sat, light);
		var h = _n0.a;
		var s = _n0.b;
		var l = _n0.c;
		var m2 = (l <= 0.5) ? (l * (s + 1)) : ((l + s) - (l * s));
		var m1 = (l * 2) - m2;
		var hueToRgb = function (h__) {
			var h_ = (h__ < 0) ? (h__ + 1) : ((h__ > 1) ? (h__ - 1) : h__);
			return ((h_ * 6) < 1) ? (m1 + (((m2 - m1) * h_) * 6)) : (((h_ * 2) < 1) ? m2 : (((h_ * 3) < 2) ? (m1 + (((m2 - m1) * ((2 / 3) - h_)) * 6)) : m1));
		};
		var b = hueToRgb(h - (1 / 3));
		var g = hueToRgb(h);
		var r = hueToRgb(h + (1 / 3));
		return A4(avh4$elm_color$Color$RgbaSpace, r, g, b, alpha);
	});
var avh4$elm_color$Color$hsl = F3(
	function (h, s, l) {
		return A4(avh4$elm_color$Color$hsla, h, s, l, 1.0);
	});
var elm$core$Basics$pi = _Basics_pi;
var elm$core$Basics$degrees = function (angleInDegrees) {
	return (angleInDegrees * elm$core$Basics$pi) / 180;
};
var author$project$Viewports$init = _List_fromArray(
	[
		A2(
		author$project$Viewports$topLeftCornerViewport,
		A3(
			avh4$elm_color$Color$hsl,
			elm$core$Basics$degrees(222),
			0.7,
			0.98),
		author$project$Viewports$viewportSide),
		A2(
		author$project$Viewports$topRightCornerViewport,
		A3(
			avh4$elm_color$Color$hsl,
			elm$core$Basics$degrees(222),
			0.53,
			0.95),
		author$project$Viewports$viewportFront),
		A2(
		author$project$Viewports$bottomLeftCornerViewport,
		A3(
			avh4$elm_color$Color$hsl,
			elm$core$Basics$degrees(222),
			0.53,
			0.95),
		author$project$Viewports$viewportTop),
		A2(
		author$project$Viewports$bottomRightCornerViewport,
		A3(
			avh4$elm_color$Color$hsl,
			elm$core$Basics$degrees(222),
			0.7,
			0.98),
		author$project$Viewports$viewportPerspective)
	]);
var elm$json$Json$Decode$decodeString = _Json_runOnString;
var elm$time$Time$Posix = function (a) {
	return {$: 'Posix', a: a};
};
var elm$time$Time$millisToPosix = elm$time$Time$Posix;
var author$project$Main$initModel = function (flag) {
	var viewports = author$project$Viewports$init;
	var viewMode = author$project$Main$Hull(author$project$Main$HullLibrary);
	return {
		blocks: author$project$DictList$empty,
		build: flag.buildSHA,
		coordinatesTransform: author$project$CoordinatesTransform$default,
		currentDate: elm$time$Time$millisToPosix(0),
		customProperties: _List_Nil,
		globalCenterOfGravity: {x: 0, y: 0, z: 0},
		multipleSelect: false,
		partitions: author$project$Main$initPartitions,
		selectedBlocks: _List_Nil,
		selectedHullReference: elm$core$Maybe$Nothing,
		slices: function () {
			var cuts = function () {
				var _n0 = A2(elm$json$Json$Decode$decodeString, author$project$EncodersDecoders$dictDecoder, flag.hullsJSON);
				if (_n0.$ === 'Ok') {
					var c = _n0.a;
					return c;
				} else {
					return elm$core$Dict$empty;
				}
			}();
			return cuts;
		}(),
		tags: _List_Nil,
		toasts: author$project$Main$emptyToasts,
		uiState: {
			accordions: elm$core$Dict$empty,
			blockContextualMenu: elm$core$Maybe$Nothing,
			newHullName: elm$core$Maybe$Nothing,
			selectedSlice: A2(author$project$StringValueInput$fromInt, 'slice no.', 1),
			showSelectedSlice: false,
			waitToPasteClipBoard: false
		},
		viewMode: viewMode,
		viewports: viewports
	};
};
var author$project$Main$toJs = _Platform_outgoingPort(
	'toJs',
	function ($) {
		return elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'data',
					elm$core$Basics$identity($.data)),
					_Utils_Tuple2(
					'tag',
					elm$json$Json$Encode$string($.tag))
				]));
	});
var elm$core$Platform$Cmd$batch = _Platform_batch;
var elm$core$Task$Perform = function (a) {
	return {$: 'Perform', a: a};
};
var elm$core$Task$succeed = _Scheduler_succeed;
var elm$core$Task$init = elm$core$Task$succeed(_Utils_Tuple0);
var elm$core$Task$andThen = _Scheduler_andThen;
var elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			elm$core$Task$andThen,
			function (a) {
				return elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			elm$core$Task$andThen,
			function (a) {
				return A2(
					elm$core$Task$andThen,
					function (b) {
						return elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var elm$core$Task$sequence = function (tasks) {
	return A3(
		elm$core$List$foldr,
		elm$core$Task$map2(elm$core$List$cons),
		elm$core$Task$succeed(_List_Nil),
		tasks);
};
var elm$core$Platform$sendToApp = _Platform_sendToApp;
var elm$core$Task$spawnCmd = F2(
	function (router, _n0) {
		var task = _n0.a;
		return _Scheduler_spawn(
			A2(
				elm$core$Task$andThen,
				elm$core$Platform$sendToApp(router),
				task));
	});
var elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			elm$core$Task$map,
			function (_n0) {
				return _Utils_Tuple0;
			},
			elm$core$Task$sequence(
				A2(
					elm$core$List$map,
					elm$core$Task$spawnCmd(router),
					commands)));
	});
var elm$core$Task$onSelfMsg = F3(
	function (_n0, _n1, _n2) {
		return elm$core$Task$succeed(_Utils_Tuple0);
	});
var elm$core$Task$cmdMap = F2(
	function (tagger, _n0) {
		var task = _n0.a;
		return elm$core$Task$Perform(
			A2(elm$core$Task$map, tagger, task));
	});
_Platform_effectManagers['Task'] = _Platform_createManager(elm$core$Task$init, elm$core$Task$onEffects, elm$core$Task$onSelfMsg, elm$core$Task$cmdMap);
var elm$core$Task$command = _Platform_leaf('Task');
var elm$core$Task$perform = F2(
	function (toMessage, task) {
		return elm$core$Task$command(
			elm$core$Task$Perform(
				A2(elm$core$Task$map, toMessage, task)));
	});
var elm$time$Time$Name = function (a) {
	return {$: 'Name', a: a};
};
var elm$time$Time$Offset = function (a) {
	return {$: 'Offset', a: a};
};
var elm$time$Time$Zone = F2(
	function (a, b) {
		return {$: 'Zone', a: a, b: b};
	});
var elm$time$Time$customZone = elm$time$Time$Zone;
var elm$time$Time$now = _Time_now(elm$time$Time$millisToPosix);
var author$project$Main$init = function (flag) {
	var model = author$project$Main$initModel(flag);
	return _Utils_Tuple2(
		model,
		elm$core$Platform$Cmd$batch(
			_List_fromArray(
				[
					author$project$Main$toJs(
					author$project$Main$initCmd(model)),
					A2(
					elm$core$Task$perform,
					A2(elm$core$Basics$composeL, author$project$Main$NoJs, author$project$Main$SetCurrentDate),
					elm$time$Time$now)
				])));
};
var elm$json$Json$Decode$string = _Json_decodeString;
var author$project$Main$fromJs = _Platform_incomingPort(
	'fromJs',
	A2(
		elm$json$Json$Decode$andThen,
		function (tag) {
			return A2(
				elm$json$Json$Decode$andThen,
				function (data) {
					return elm$json$Json$Decode$succeed(
						{data: data, tag: tag});
				},
				A2(elm$json$Json$Decode$field, 'data', elm$json$Json$Decode$value));
		},
		A2(elm$json$Json$Decode$field, 'tag', elm$json$Json$Decode$string)));
var author$project$Main$AddToSelection = function (a) {
	return {$: 'AddToSelection', a: a};
};
var author$project$Main$DismissToast = function (a) {
	return {$: 'DismissToast', a: a};
};
var author$project$Main$DisplayToast = function (a) {
	return {$: 'DisplayToast', a: a};
};
var author$project$Main$FromJs = function (a) {
	return {$: 'FromJs', a: a};
};
var author$project$Main$ImportHullsLibrary = function (a) {
	return {$: 'ImportHullsLibrary', a: a};
};
var author$project$Main$JSError = function (a) {
	return {$: 'JSError', a: a};
};
var author$project$Main$NewBlock = function (a) {
	return {$: 'NewBlock', a: a};
};
var author$project$Main$PasteClipBoard = function (a) {
	return {$: 'PasteClipBoard', a: a};
};
var author$project$Main$RemoveFromSelection = function (a) {
	return {$: 'RemoveFromSelection', a: a};
};
var author$project$Main$RestoreSave = function (a) {
	return {$: 'RestoreSave', a: a};
};
var author$project$Main$Select = function (a) {
	return {$: 'Select', a: a};
};
var author$project$Main$SelectPartition = F3(
	function (a, b, c) {
		return {$: 'SelectPartition', a: a, b: b, c: c};
	});
var author$project$Main$SynchronizePosition = F2(
	function (a, b) {
		return {$: 'SynchronizePosition', a: a, b: b};
	});
var author$project$Main$SynchronizePositions = function (a) {
	return {$: 'SynchronizePositions', a: a};
};
var author$project$Main$SynchronizeSize = F2(
	function (a, b) {
		return {$: 'SynchronizeSize', a: a, b: b};
	});
var author$project$Main$Unselect = {$: 'Unselect'};
var author$project$Main$Block = function (uuid) {
	return function (label) {
		return function (color) {
			return function (position) {
				return function (size) {
					return function (referenceForMass) {
						return function (mass) {
							return function (density) {
								return function (visible) {
									return function (centerOfGravity) {
										return function (centerOfGravityFixed) {
											return {centerOfGravity: centerOfGravity, centerOfGravityFixed: centerOfGravityFixed, color: color, density: density, label: label, mass: mass, position: position, referenceForMass: referenceForMass, size: size, uuid: uuid, visible: visible};
										};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var author$project$Main$None = {$: 'None'};
var avh4$elm_color$Color$rgba = F4(
	function (r, g, b, a) {
		return A4(avh4$elm_color$Color$RgbaSpace, r, g, b, a);
	});
var author$project$Main$decodeColor = A4(
	NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
	'alpha',
	elm$json$Json$Decode$float,
	1,
	A3(
		NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'blue',
		elm$json$Json$Decode$float,
		A3(
			NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'green',
			elm$json$Json$Decode$float,
			A3(
				NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'red',
				elm$json$Json$Decode$float,
				elm$json$Json$Decode$succeed(avh4$elm_color$Color$rgba)))));
var author$project$Main$Position = F3(
	function (x, y, z) {
		return {x: x, y: y, z: z};
	});
var author$project$StringValueInput$floatInputDecoder = F3(
	function (nbOfDigits, unit, description) {
		return A2(
			elm$json$Json$Decode$map,
			A3(author$project$StringValueInput$fromNumber, unit, description, nbOfDigits),
			elm$json$Json$Decode$float);
	});
var author$project$Main$decodePosition = A3(
	NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'z',
	A3(author$project$StringValueInput$floatInputDecoder, 1, 'm', 'z'),
	A3(
		NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'y',
		A3(author$project$StringValueInput$floatInputDecoder, 1, 'm', 'y'),
		A3(
			NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'x',
			A3(author$project$StringValueInput$floatInputDecoder, 1, 'm', 'x'),
			elm$json$Json$Decode$succeed(author$project$Main$Position))));
var author$project$Main$Density = {$: 'Density'};
var author$project$Main$Mass = {$: 'Mass'};
var author$project$Main$decodeReferenceForMass = A2(
	elm$json$Json$Decode$andThen,
	function (str) {
		switch (str) {
			case 'None':
				return elm$json$Json$Decode$succeed(author$project$Main$None);
			case 'Mass':
				return elm$json$Json$Decode$succeed(author$project$Main$Mass);
			case 'Density':
				return elm$json$Json$Decode$succeed(author$project$Main$Density);
			default:
				var somethingElse = str;
				return elm$json$Json$Decode$fail('Unknown referenceForMass : ' + somethingElse);
		}
	},
	elm$json$Json$Decode$string);
var author$project$Main$Size = F3(
	function (length, width, height) {
		return {height: height, length: length, width: width};
	});
var author$project$Main$decodeSize = A3(
	NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'z',
	A3(author$project$StringValueInput$floatInputDecoder, 1, 'm', 'z'),
	A3(
		NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'y',
		A3(author$project$StringValueInput$floatInputDecoder, 1, 'm', 'y'),
		A3(
			NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'x',
			A3(author$project$StringValueInput$floatInputDecoder, 1, 'm', 'x'),
			elm$json$Json$Decode$succeed(author$project$Main$Size))));
var author$project$Main$initPosition = {
	x: A4(author$project$StringValueInput$fromNumber, 'm', 'x', 1, 5),
	y: A4(author$project$StringValueInput$fromNumber, 'm', 'y', 1, 2.5),
	z: A4(author$project$StringValueInput$fromNumber, 'm', 'z', 1, 2.5)
};
var author$project$Main$getRelativeCenterOfVolume = function (block) {
	return {
		x: A2(author$project$StringValueInput$round_n, 2, 0.5 * block.size.length.value),
		y: A2(author$project$StringValueInput$round_n, 2, 0.5 * block.size.width.value),
		z: A2(author$project$StringValueInput$round_n, 2, 0.5 * block.size.height.value)
	};
};
var author$project$Main$updateBlockCenterOfGravity = function (block) {
	var centerOfVolume = author$project$Main$getRelativeCenterOfVolume(block);
	return _Utils_update(
		block,
		{
			centerOfGravity: {
				x: A4(author$project$StringValueInput$fromNumber, 'm', 'x', 1, centerOfVolume.x),
				y: A4(author$project$StringValueInput$fromNumber, 'm', 'y', 1, centerOfVolume.y),
				z: A4(author$project$StringValueInput$fromNumber, 'm', 'z', 1, centerOfVolume.z)
			}
		});
};
var elm$json$Json$Decode$bool = _Json_decodeBool;
var author$project$Main$decodeBlock = function () {
	var d = A4(
		NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
		'centerOfGravityFixed',
		elm$json$Json$Decode$bool,
		false,
		A4(
			NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
			'centerOfGravity',
			author$project$Main$decodePosition,
			author$project$Main$initPosition,
			A4(
				NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
				'visible',
				elm$json$Json$Decode$bool,
				true,
				A4(
					NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
					'density',
					A3(author$project$StringValueInput$floatInputDecoder, 1, 'kg/m^3', 'Density'),
					author$project$StringValueInput$emptyFloat(1),
					A4(
						NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
						'mass',
						A3(author$project$StringValueInput$floatInputDecoder, 1, 'm', 'Mass'),
						author$project$StringValueInput$emptyFloat(1),
						A4(
							NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
							'referenceForMass',
							author$project$Main$decodeReferenceForMass,
							author$project$Main$None,
							A3(
								NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
								'size',
								author$project$Main$decodeSize,
								A3(
									NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
									'position',
									author$project$Main$decodePosition,
									A3(
										NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
										'color',
										author$project$Main$decodeColor,
										A3(
											NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
											'label',
											elm$json$Json$Decode$string,
											A3(
												NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
												'uuid',
												elm$json$Json$Decode$string,
												elm$json$Json$Decode$succeed(author$project$Main$Block))))))))))));
	return A2(elm$json$Json$Decode$map, author$project$Main$updateBlockCenterOfGravity, d);
}();
var author$project$Main$SaveFile = F7(
	function (selectedHullReference, hulls, blocks, coordinatesTransform, partitions, tags, customProperties) {
		return {blocks: blocks, coordinatesTransform: coordinatesTransform, customProperties: customProperties, hulls: hulls, partitions: partitions, selectedHullReference: selectedHullReference, tags: tags};
	});
var author$project$Main$decodeBlocks = elm$json$Json$Decode$list(author$project$Main$decodeBlock);
var author$project$Main$saveFileDecoderV1 = A2(
	NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$hardcoded,
	_List_Nil,
	A2(
		NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$hardcoded,
		_List_Nil,
		A2(
			NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$hardcoded,
			author$project$Main$initPartitions,
			A3(
				NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'coordinatesTransform',
				elm$json$Json$Decode$list(elm$json$Json$Decode$float),
				A3(
					NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
					'blocks',
					author$project$Main$decodeBlocks,
					A4(
						NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
						'hulls',
						author$project$EncodersDecoders$dictDecoder,
						elm$core$Dict$empty,
						A4(
							NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
							'selectedHullReference',
							A2(elm$json$Json$Decode$map, elm$core$Maybe$Just, elm$json$Json$Decode$string),
							elm$core$Maybe$Nothing,
							elm$json$Json$Decode$succeed(author$project$Main$SaveFile))))))));
var author$project$Main$CustomProperty = F2(
	function (label, values) {
		return {label: label, values: values};
	});
var author$project$Main$decodeCustomPropertyValues = elm$json$Json$Decode$dict(elm$json$Json$Decode$string);
var author$project$Main$decodeCustomProperty = A3(
	NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'values',
	author$project$Main$decodeCustomPropertyValues,
	A3(
		NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'label',
		elm$json$Json$Decode$string,
		elm$json$Json$Decode$succeed(author$project$Main$CustomProperty)));
var author$project$Main$decodeCustomProperties = elm$json$Json$Decode$list(author$project$Main$decodeCustomProperty);
var author$project$Main$PartitionsData = F3(
	function (decks, bulkheads, showing) {
		return {bulkheads: bulkheads, decks: decks, showing: showing};
	});
var author$project$Main$Bulkheads = F4(
	function (number, spacing, zero, spacingExceptions) {
		return {number: number, spacing: spacing, spacingExceptions: spacingExceptions, zero: zero};
	});
var author$project$Main$PartitionZero = F2(
	function (index, position) {
		return {index: index, position: position};
	});
var elm$json$Json$Decode$int = _Json_decodeInt;
var author$project$Main$decodePartitionZero = A3(
	NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'position',
	A3(author$project$StringValueInput$floatInputDecoder, 1, 'm', 'Position'),
	A3(
		NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'index',
		elm$json$Json$Decode$int,
		elm$json$Json$Decode$succeed(author$project$Main$PartitionZero)));
var elm$core$String$toInt = _String_toInt;
var author$project$StringValueInput$decodeSpacingExceptions = function () {
	var makeException = F3(
		function (key, value, dict) {
			var _n0 = elm$core$String$toInt(key);
			if (_n0.$ === 'Just') {
				var intKey = _n0.a;
				return A3(
					elm$core$Dict$insert,
					intKey,
					A4(author$project$StringValueInput$fromNumber, '', '', 0, value),
					dict);
			} else {
				return dict;
			}
		});
	var parse = function (dict) {
		return A3(elm$core$Dict$foldl, makeException, elm$core$Dict$empty, dict);
	};
	return A2(
		elm$json$Json$Decode$map,
		parse,
		elm$json$Json$Decode$dict(elm$json$Json$Decode$float));
}();
var author$project$Main$decodeBulkheads = A4(
	NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
	'spacingExceptions',
	author$project$StringValueInput$decodeSpacingExceptions,
	elm$core$Dict$empty,
	A3(
		NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'zero',
		author$project$Main$decodePartitionZero,
		A3(
			NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'spacing',
			A3(author$project$StringValueInput$floatInputDecoder, 1, 'm', 'Spacing'),
			A3(
				NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'number',
				A2(
					elm$json$Json$Decode$map,
					author$project$StringValueInput$fromInt('Number of decks'),
					elm$json$Json$Decode$int),
				elm$json$Json$Decode$succeed(author$project$Main$Bulkheads)))));
var author$project$Main$Decks = F4(
	function (number, spacing, zero, spacingExceptions) {
		return {number: number, spacing: spacing, spacingExceptions: spacingExceptions, zero: zero};
	});
var author$project$Main$decodeDecks = A4(
	NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
	'spacingExceptions',
	author$project$StringValueInput$decodeSpacingExceptions,
	elm$core$Dict$empty,
	A3(
		NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'zero',
		author$project$Main$decodePartitionZero,
		A3(
			NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'spacing',
			A3(author$project$StringValueInput$floatInputDecoder, 1, 'm', 'Spacing'),
			A3(
				NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'number',
				A2(
					elm$json$Json$Decode$map,
					author$project$StringValueInput$fromInt('Number of decks'),
					elm$json$Json$Decode$int),
				elm$json$Json$Decode$succeed(author$project$Main$Decks)))));
var author$project$Main$decodePartitions = A2(
	NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$hardcoded,
	true,
	A3(
		NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'bulkheads',
		author$project$Main$decodeBulkheads,
		A3(
			NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'decks',
			author$project$Main$decodeDecks,
			elm$json$Json$Decode$succeed(author$project$Main$PartitionsData))));
var author$project$Main$Tag = F2(
	function (label, color) {
		return {color: color, label: label};
	});
var author$project$SIRColorPicker$Black = {$: 'Black'};
var author$project$SIRColorPicker$getName = function (sirColor) {
	switch (sirColor.$) {
		case 'Red':
			return 'Red';
		case 'Pink':
			return 'Pink';
		case 'Purple':
			return 'Purple';
		case 'DeepPurple':
			return 'DeepPurple';
		case 'Indigo':
			return 'Indigo';
		case 'Blue':
			return 'Blue';
		case 'LightBlue':
			return 'LightBlue';
		case 'Cyan':
			return 'Cyan';
		case 'Teal':
			return 'Teal';
		case 'Green':
			return 'Green';
		case 'LightGreen':
			return 'LightGreen';
		case 'Lime':
			return 'Lime';
		case 'Yellow':
			return 'Yellow';
		case 'Amber':
			return 'Amber';
		case 'Orange':
			return 'Orange';
		case 'DeepOrange':
			return 'DeepOrange';
		case 'Brown':
			return 'Brown';
		default:
			return 'Black';
	}
};
var author$project$SIRColorPicker$Amber = {$: 'Amber'};
var author$project$SIRColorPicker$Blue = {$: 'Blue'};
var author$project$SIRColorPicker$Brown = {$: 'Brown'};
var author$project$SIRColorPicker$Cyan = {$: 'Cyan'};
var author$project$SIRColorPicker$DeepOrange = {$: 'DeepOrange'};
var author$project$SIRColorPicker$DeepPurple = {$: 'DeepPurple'};
var author$project$SIRColorPicker$Green = {$: 'Green'};
var author$project$SIRColorPicker$Indigo = {$: 'Indigo'};
var author$project$SIRColorPicker$LightBlue = {$: 'LightBlue'};
var author$project$SIRColorPicker$LightGreen = {$: 'LightGreen'};
var author$project$SIRColorPicker$Lime = {$: 'Lime'};
var author$project$SIRColorPicker$Orange = {$: 'Orange'};
var author$project$SIRColorPicker$Pink = {$: 'Pink'};
var author$project$SIRColorPicker$Purple = {$: 'Purple'};
var author$project$SIRColorPicker$Red = {$: 'Red'};
var author$project$SIRColorPicker$Teal = {$: 'Teal'};
var author$project$SIRColorPicker$Yellow = {$: 'Yellow'};
var author$project$SIRColorPicker$palette = _List_fromArray(
	[author$project$SIRColorPicker$Red, author$project$SIRColorPicker$Pink, author$project$SIRColorPicker$Purple, author$project$SIRColorPicker$DeepPurple, author$project$SIRColorPicker$Indigo, author$project$SIRColorPicker$Blue, author$project$SIRColorPicker$LightBlue, author$project$SIRColorPicker$Cyan, author$project$SIRColorPicker$Teal, author$project$SIRColorPicker$Green, author$project$SIRColorPicker$LightGreen, author$project$SIRColorPicker$Lime, author$project$SIRColorPicker$Yellow, author$project$SIRColorPicker$Amber, author$project$SIRColorPicker$Orange, author$project$SIRColorPicker$DeepOrange, author$project$SIRColorPicker$Brown, author$project$SIRColorPicker$Black]);
var elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2(elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var author$project$SIRColorPicker$fromName = function (name) {
	return elm$core$List$head(
		A2(
			elm$core$List$filter,
			A2(
				elm$core$Basics$composeL,
				elm$core$Basics$eq(name),
				author$project$SIRColorPicker$getName),
			author$project$SIRColorPicker$palette));
};
var author$project$Main$decodeTag = function () {
	var getColorFromName = function (name) {
		return A2(
			elm$core$Maybe$withDefault,
			author$project$SIRColorPicker$Black,
			author$project$SIRColorPicker$fromName(name));
	};
	return A3(
		NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'color',
		A2(elm$json$Json$Decode$map, getColorFromName, elm$json$Json$Decode$string),
		A3(
			NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'label',
			elm$json$Json$Decode$string,
			elm$json$Json$Decode$succeed(author$project$Main$Tag)));
}();
var author$project$Main$decodeTags = elm$json$Json$Decode$list(author$project$Main$decodeTag);
var author$project$Main$saveFileDecoderV2 = A4(
	NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
	'customProperties',
	author$project$Main$decodeCustomProperties,
	_List_Nil,
	A4(
		NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
		'tags',
		author$project$Main$decodeTags,
		_List_Nil,
		A3(
			NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'partitions',
			author$project$Main$decodePartitions,
			A3(
				NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'coordinatesTransform',
				elm$json$Json$Decode$list(elm$json$Json$Decode$float),
				A3(
					NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
					'blocks',
					author$project$Main$decodeBlocks,
					A4(
						NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
						'hulls',
						author$project$EncodersDecoders$dictDecoder,
						elm$core$Dict$empty,
						A4(
							NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
							'selectedHullReference',
							A2(elm$json$Json$Decode$map, elm$core$Maybe$Just, elm$json$Json$Decode$string),
							elm$core$Maybe$Nothing,
							elm$json$Json$Decode$succeed(author$project$Main$SaveFile))))))));
var author$project$Main$decodeSaveFile = function (version) {
	switch (version) {
		case 1:
			return author$project$Main$saveFileDecoderV1;
		case 2:
			return author$project$Main$saveFileDecoderV2;
		default:
			return elm$json$Json$Decode$fail(
				'Unknown version ' + elm$core$String$fromInt(version));
	}
};
var author$project$Main$decodeVersion = A2(elm$json$Json$Decode$field, 'version', elm$json$Json$Decode$int);
var elm$core$Basics$not = _Basics_not;
var elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var elm$core$List$all = F2(
	function (isOkay, list) {
		return !A2(
			elm$core$List$any,
			A2(elm$core$Basics$composeL, elm$core$Basics$not, isOkay),
			list);
	});
var elm$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (n <= 0) {
				return list;
			} else {
				if (!list.b) {
					return list;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs;
					n = $temp$n;
					list = $temp$list;
					continue drop;
				}
			}
		}
	});
var elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _n0 = f(mx);
		if (_n0.$ === 'Just') {
			var x = _n0.a;
			return A2(elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			elm$core$List$foldr,
			elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var elm$core$List$isEmpty = function (xs) {
	if (!xs.b) {
		return true;
	} else {
		return false;
	}
};
var elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return elm$core$Maybe$Just(
				f(value));
		} else {
			return elm$core$Maybe$Nothing;
		}
	});
var elm$core$String$toFloat = _String_toFloat;
var author$project$Main$formatClipboardData = function (data) {
	var listCoordinate = A2(
		elm$core$List$filter,
		A2(elm$core$Basics$composeL, elm$core$Basics$not, elm$core$List$isEmpty),
		A2(
			elm$core$List$map,
			elm$core$List$filterMap(elm$core$String$toFloat),
			A2(
				elm$core$List$map,
				elm$core$String$split('\t'),
				A2(elm$core$String$split, '\n', data))));
	var controlFormat = A2(
		elm$core$List$all,
		elm$core$Basics$eq(3),
		A2(elm$core$List$map, elm$core$List$length, listCoordinate));
	var constructCoordinate = function (coordinateList) {
		return {
			x: A2(
				elm$core$Maybe$withDefault,
				0,
				elm$core$List$head(coordinateList)),
			y: A2(
				elm$core$Maybe$withDefault,
				0,
				elm$core$List$head(
					A2(elm$core$List$drop, 1, coordinateList))),
			z: A2(
				elm$core$Maybe$withDefault,
				0,
				A2(
					elm$core$Maybe$map,
					elm$core$Basics$negate,
					elm$core$List$head(
						A2(elm$core$List$drop, 2, coordinateList))))
		};
	};
	return controlFormat ? elm$core$Maybe$Just(
		A2(elm$core$List$map, constructCoordinate, listCoordinate)) : elm$core$Maybe$Nothing;
};
var author$project$Main$SelectPartitionData = F3(
	function (partitionType, partitionIndex, partitionPosition) {
		return {partitionIndex: partitionIndex, partitionPosition: partitionPosition, partitionType: partitionType};
	});
var author$project$Main$Bulkhead = {$: 'Bulkhead'};
var author$project$Main$Deck = {$: 'Deck'};
var author$project$Main$partitionTypeFromString = function (str) {
	switch (str) {
		case 'deck':
			return elm$json$Json$Decode$succeed(author$project$Main$Deck);
		case 'bulkhead':
			return elm$json$Json$Decode$succeed(author$project$Main$Bulkhead);
		default:
			return elm$json$Json$Decode$fail('Trying to decode partitionType, but ' + (str + ' is not supported.'));
	}
};
var author$project$Main$selectPartitionDecoder = A3(
	NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'partitionPosition',
	elm$json$Json$Decode$float,
	A3(
		NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'partitionIndex',
		elm$json$Json$Decode$int,
		A3(
			NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'partitionType',
			A2(elm$json$Json$Decode$andThen, author$project$Main$partitionTypeFromString, elm$json$Json$Decode$string),
			elm$json$Json$Decode$succeed(author$project$Main$SelectPartitionData))));
var author$project$Main$SyncPosition = F2(
	function (uuid, position) {
		return {position: position, uuid: uuid};
	});
var author$project$Main$syncPositionDecoder = A3(
	NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'position',
	author$project$Main$decodePosition,
	A3(
		NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'uuid',
		elm$json$Json$Decode$string,
		elm$json$Json$Decode$succeed(author$project$Main$SyncPosition)));
var author$project$Main$SyncSize = F2(
	function (uuid, size) {
		return {size: size, uuid: uuid};
	});
var author$project$Main$syncSizeDecoder = A3(
	NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'size',
	author$project$Main$decodeSize,
	A3(
		NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'uuid',
		elm$json$Json$Decode$string,
		elm$json$Json$Decode$succeed(author$project$Main$SyncSize)));
var author$project$Main$Toast = F3(
	function (key, message, type_) {
		return {key: key, message: message, type_: type_};
	});
var author$project$Main$Error = {$: 'Error'};
var author$project$Main$Info = {$: 'Info'};
var author$project$Main$Processing = {$: 'Processing'};
var author$project$Main$Success = {$: 'Success'};
var author$project$Main$toastTypeDecoder = A2(
	elm$json$Json$Decode$andThen,
	function (str) {
		switch (str) {
			case 'info':
				return elm$json$Json$Decode$succeed(author$project$Main$Info);
			case 'error':
				return elm$json$Json$Decode$succeed(author$project$Main$Error);
			case 'success':
				return elm$json$Json$Decode$succeed(author$project$Main$Success);
			case 'processing':
				return elm$json$Json$Decode$succeed(author$project$Main$Processing);
			default:
				var somethingElse = str;
				return elm$json$Json$Decode$fail('Unknown toast type : ' + somethingElse);
		}
	},
	elm$json$Json$Decode$string);
var author$project$Main$toastDecoder = A3(
	NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'type',
	author$project$Main$toastTypeDecoder,
	A3(
		NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'message',
		elm$json$Json$Decode$string,
		A3(
			NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'key',
			elm$json$Json$Decode$string,
			elm$json$Json$Decode$succeed(author$project$Main$Toast))));
var author$project$Main$jsMsgToMsg = function (js) {
	var _n0 = js.tag;
	switch (_n0) {
		case 'add-to-selection':
			var _n1 = A2(elm$json$Json$Decode$decodeValue, elm$json$Json$Decode$string, js.data);
			if (_n1.$ === 'Ok') {
				var uuid = _n1.a;
				return author$project$Main$FromJs(
					author$project$Main$AddToSelection(uuid));
			} else {
				var message = _n1.a;
				return author$project$Main$FromJs(
					author$project$Main$JSError(
						elm$json$Json$Decode$errorToString(message)));
			}
		case 'dismiss-toast':
			var _n2 = A2(elm$json$Json$Decode$decodeValue, elm$json$Json$Decode$string, js.data);
			if (_n2.$ === 'Ok') {
				var key = _n2.a;
				return author$project$Main$NoJs(
					author$project$Main$DismissToast(key));
			} else {
				var message = _n2.a;
				return author$project$Main$FromJs(
					author$project$Main$JSError(
						elm$json$Json$Decode$errorToString(message)));
			}
		case 'display-toast':
			var _n3 = A2(elm$json$Json$Decode$decodeValue, author$project$Main$toastDecoder, js.data);
			if (_n3.$ === 'Ok') {
				var toast = _n3.a;
				return author$project$Main$NoJs(
					author$project$Main$DisplayToast(toast));
			} else {
				var message = _n3.a;
				return author$project$Main$FromJs(
					author$project$Main$JSError(
						elm$json$Json$Decode$errorToString(message)));
			}
		case 'save-data':
			var _n4 = A2(
				elm$json$Json$Decode$decodeValue,
				A2(elm$json$Json$Decode$andThen, author$project$Main$decodeSaveFile, author$project$Main$decodeVersion),
				js.data);
			if (_n4.$ === 'Ok') {
				var fileContents = _n4.a;
				return author$project$Main$FromJs(
					author$project$Main$RestoreSave(fileContents));
			} else {
				var message = _n4.a;
				return author$project$Main$FromJs(
					author$project$Main$JSError(
						elm$json$Json$Decode$errorToString(message)));
			}
		case 'import-data':
			var _n5 = A2(
				elm$json$Json$Decode$decodeValue,
				A2(elm$json$Json$Decode$andThen, author$project$Main$decodeSaveFile, author$project$Main$decodeVersion),
				js.data);
			if (_n5.$ === 'Ok') {
				var fileContents = _n5.a;
				return author$project$Main$FromJs(
					author$project$Main$ImportHullsLibrary(fileContents));
			} else {
				var message = _n5.a;
				return author$project$Main$FromJs(
					author$project$Main$JSError(
						elm$json$Json$Decode$errorToString(message)));
			}
		case 'paste-clipboard':
			var _n6 = A2(elm$json$Json$Decode$decodeValue, elm$json$Json$Decode$string, js.data);
			if (_n6.$ === 'Ok') {
				var dataString = _n6.a;
				var _n7 = author$project$Main$formatClipboardData(dataString);
				if (_n7.$ === 'Just') {
					var coordinates = _n7.a;
					return author$project$Main$FromJs(
						author$project$Main$PasteClipBoard(coordinates));
				} else {
					return author$project$Main$FromJs(
						author$project$Main$JSError('Clipboard data have incorrect format'));
				}
			} else {
				var message = _n6.a;
				return author$project$Main$FromJs(
					author$project$Main$JSError(
						elm$json$Json$Decode$errorToString(message)));
			}
		case 'new-block':
			var _n8 = A2(elm$json$Json$Decode$decodeValue, author$project$Main$decodeBlock, js.data);
			if (_n8.$ === 'Ok') {
				var block = _n8.a;
				return author$project$Main$FromJs(
					author$project$Main$NewBlock(block));
			} else {
				var message = _n8.a;
				return author$project$Main$FromJs(
					author$project$Main$JSError(
						elm$json$Json$Decode$errorToString(message)));
			}
		case 'remove-from-selection':
			var _n9 = A2(elm$json$Json$Decode$decodeValue, elm$json$Json$Decode$string, js.data);
			if (_n9.$ === 'Ok') {
				var uuid = _n9.a;
				return author$project$Main$FromJs(
					author$project$Main$RemoveFromSelection(uuid));
			} else {
				var message = _n9.a;
				return author$project$Main$FromJs(
					author$project$Main$JSError(
						elm$json$Json$Decode$errorToString(message)));
			}
		case 'select':
			var _n10 = A2(elm$json$Json$Decode$decodeValue, elm$json$Json$Decode$string, js.data);
			if (_n10.$ === 'Ok') {
				var uuid = _n10.a;
				return author$project$Main$FromJs(
					author$project$Main$Select(uuid));
			} else {
				var message = _n10.a;
				return author$project$Main$FromJs(
					author$project$Main$JSError(
						elm$json$Json$Decode$errorToString(message)));
			}
		case 'select-partition':
			var _n11 = A2(elm$json$Json$Decode$decodeValue, author$project$Main$selectPartitionDecoder, js.data);
			if (_n11.$ === 'Ok') {
				var selectionData = _n11.a;
				return author$project$Main$FromJs(
					A3(author$project$Main$SelectPartition, selectionData.partitionType, selectionData.partitionIndex, selectionData.partitionPosition));
			} else {
				var message = _n11.a;
				return author$project$Main$FromJs(
					author$project$Main$JSError(
						elm$json$Json$Decode$errorToString(message)));
			}
		case 'sync-position':
			var _n12 = A2(elm$json$Json$Decode$decodeValue, author$project$Main$syncPositionDecoder, js.data);
			if (_n12.$ === 'Ok') {
				var syncPosition = _n12.a;
				return author$project$Main$FromJs(
					A2(author$project$Main$SynchronizePosition, syncPosition.uuid, syncPosition.position));
			} else {
				var message = _n12.a;
				return author$project$Main$FromJs(
					author$project$Main$JSError(
						elm$json$Json$Decode$errorToString(message)));
			}
		case 'sync-positions':
			var _n13 = A2(
				elm$json$Json$Decode$decodeValue,
				elm$json$Json$Decode$list(author$project$Main$syncPositionDecoder),
				js.data);
			if (_n13.$ === 'Ok') {
				var syncPositions = _n13.a;
				return author$project$Main$FromJs(
					author$project$Main$SynchronizePositions(
						elm$core$Dict$fromList(
							A2(
								elm$core$List$map,
								function (syncPos) {
									return _Utils_Tuple2(syncPos.uuid, syncPos);
								},
								syncPositions))));
			} else {
				var message = _n13.a;
				return author$project$Main$FromJs(
					author$project$Main$JSError(
						elm$json$Json$Decode$errorToString(message)));
			}
		case 'sync-size':
			var _n14 = A2(elm$json$Json$Decode$decodeValue, author$project$Main$syncSizeDecoder, js.data);
			if (_n14.$ === 'Ok') {
				var syncSize = _n14.a;
				return author$project$Main$FromJs(
					A2(author$project$Main$SynchronizeSize, syncSize.uuid, syncSize.size));
			} else {
				var message = _n14.a;
				return author$project$Main$FromJs(
					author$project$Main$JSError(
						elm$json$Json$Decode$errorToString(message)));
			}
		case 'unselect':
			return author$project$Main$FromJs(author$project$Main$Unselect);
		default:
			var unknownTag = _n0;
			return author$project$Main$FromJs(
				author$project$Main$JSError('Unknown tag received from JS: ' + unknownTag));
	}
};
var author$project$Main$keyDecoder = A2(elm$json$Json$Decode$field, 'key', elm$json$Json$Decode$string);
var author$project$Main$NoOp = {$: 'NoOp'};
var author$project$Main$SetMultipleSelect = function (a) {
	return {$: 'SetMultipleSelect', a: a};
};
var author$project$Main$keydownToMsg = function (keyCode) {
	if (keyCode === '17') {
		return author$project$Main$NoJs(
			author$project$Main$SetMultipleSelect(true));
	} else {
		return author$project$Main$NoJs(author$project$Main$NoOp);
	}
};
var author$project$Main$keyupToMsg = function (keyCode) {
	if (keyCode === '17') {
		return author$project$Main$NoJs(
			author$project$Main$SetMultipleSelect(false));
	} else {
		return author$project$Main$NoJs(author$project$Main$NoOp);
	}
};
var elm$browser$Browser$Events$Document = {$: 'Document'};
var elm$browser$Browser$Events$MySub = F3(
	function (a, b, c) {
		return {$: 'MySub', a: a, b: b, c: c};
	});
var elm$browser$Browser$Events$State = F2(
	function (subs, pids) {
		return {pids: pids, subs: subs};
	});
var elm$browser$Browser$Events$init = elm$core$Task$succeed(
	A2(elm$browser$Browser$Events$State, _List_Nil, elm$core$Dict$empty));
var elm$browser$Browser$Events$nodeToKey = function (node) {
	if (node.$ === 'Document') {
		return 'd_';
	} else {
		return 'w_';
	}
};
var elm$browser$Browser$Events$addKey = function (sub) {
	var node = sub.a;
	var name = sub.b;
	return _Utils_Tuple2(
		_Utils_ap(
			elm$browser$Browser$Events$nodeToKey(node),
			name),
		sub);
};
var elm$browser$Browser$Events$Event = F2(
	function (key, event) {
		return {event: event, key: key};
	});
var elm$core$Platform$sendToSelf = _Platform_sendToSelf;
var elm$browser$Browser$External = function (a) {
	return {$: 'External', a: a};
};
var elm$browser$Browser$Internal = function (a) {
	return {$: 'Internal', a: a};
};
var elm$browser$Browser$Dom$NotFound = function (a) {
	return {$: 'NotFound', a: a};
};
var elm$core$Basics$never = function (_n0) {
	never:
	while (true) {
		var nvr = _n0.a;
		var $temp$_n0 = nvr;
		_n0 = $temp$_n0;
		continue never;
	}
};
var elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 'Normal':
			return 0;
		case 'MayStopPropagation':
			return 1;
		case 'MayPreventDefault':
			return 2;
		default:
			return 3;
	}
};
var elm$core$String$length = _String_length;
var elm$core$String$slice = _String_slice;
var elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			elm$core$String$slice,
			n,
			elm$core$String$length(string),
			string);
	});
var elm$core$String$startsWith = _String_startsWith;
var elm$url$Url$Http = {$: 'Http'};
var elm$url$Url$Https = {$: 'Https'};
var elm$core$String$indexes = _String_indexes;
var elm$core$String$isEmpty = function (string) {
	return string === '';
};
var elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3(elm$core$String$slice, 0, n, string);
	});
var elm$core$String$contains = _String_contains;
var elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {fragment: fragment, host: host, path: path, port_: port_, protocol: protocol, query: query};
	});
var elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if (elm$core$String$isEmpty(str) || A2(elm$core$String$contains, '@', str)) {
			return elm$core$Maybe$Nothing;
		} else {
			var _n0 = A2(elm$core$String$indexes, ':', str);
			if (!_n0.b) {
				return elm$core$Maybe$Just(
					A6(elm$url$Url$Url, protocol, str, elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_n0.b.b) {
					var i = _n0.a;
					var _n1 = elm$core$String$toInt(
						A2(elm$core$String$dropLeft, i + 1, str));
					if (_n1.$ === 'Nothing') {
						return elm$core$Maybe$Nothing;
					} else {
						var port_ = _n1;
						return elm$core$Maybe$Just(
							A6(
								elm$url$Url$Url,
								protocol,
								A2(elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return elm$core$Maybe$Nothing;
				}
			}
		}
	});
var elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if (elm$core$String$isEmpty(str)) {
			return elm$core$Maybe$Nothing;
		} else {
			var _n0 = A2(elm$core$String$indexes, '/', str);
			if (!_n0.b) {
				return A5(elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _n0.a;
				return A5(
					elm$url$Url$chompBeforePath,
					protocol,
					A2(elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2(elm$core$String$left, i, str));
			}
		}
	});
var elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if (elm$core$String$isEmpty(str)) {
			return elm$core$Maybe$Nothing;
		} else {
			var _n0 = A2(elm$core$String$indexes, '?', str);
			if (!_n0.b) {
				return A4(elm$url$Url$chompBeforeQuery, protocol, elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _n0.a;
				return A4(
					elm$url$Url$chompBeforeQuery,
					protocol,
					elm$core$Maybe$Just(
						A2(elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2(elm$core$String$left, i, str));
			}
		}
	});
var elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if (elm$core$String$isEmpty(str)) {
			return elm$core$Maybe$Nothing;
		} else {
			var _n0 = A2(elm$core$String$indexes, '#', str);
			if (!_n0.b) {
				return A3(elm$url$Url$chompBeforeFragment, protocol, elm$core$Maybe$Nothing, str);
			} else {
				var i = _n0.a;
				return A3(
					elm$url$Url$chompBeforeFragment,
					protocol,
					elm$core$Maybe$Just(
						A2(elm$core$String$dropLeft, i + 1, str)),
					A2(elm$core$String$left, i, str));
			}
		}
	});
var elm$url$Url$fromString = function (str) {
	return A2(elm$core$String$startsWith, 'http://', str) ? A2(
		elm$url$Url$chompAfterProtocol,
		elm$url$Url$Http,
		A2(elm$core$String$dropLeft, 7, str)) : (A2(elm$core$String$startsWith, 'https://', str) ? A2(
		elm$url$Url$chompAfterProtocol,
		elm$url$Url$Https,
		A2(elm$core$String$dropLeft, 8, str)) : elm$core$Maybe$Nothing);
};
var elm$browser$Browser$Events$spawn = F3(
	function (router, key, _n0) {
		var node = _n0.a;
		var name = _n0.b;
		var actualNode = function () {
			if (node.$ === 'Document') {
				return _Browser_doc;
			} else {
				return _Browser_window;
			}
		}();
		return A2(
			elm$core$Task$map,
			function (value) {
				return _Utils_Tuple2(key, value);
			},
			A3(
				_Browser_on,
				actualNode,
				name,
				function (event) {
					return A2(
						elm$core$Platform$sendToSelf,
						router,
						A2(elm$browser$Browser$Events$Event, key, event));
				}));
	});
var elm$core$Dict$merge = F6(
	function (leftStep, bothStep, rightStep, leftDict, rightDict, initialResult) {
		var stepState = F3(
			function (rKey, rValue, _n0) {
				stepState:
				while (true) {
					var list = _n0.a;
					var result = _n0.b;
					if (!list.b) {
						return _Utils_Tuple2(
							list,
							A3(rightStep, rKey, rValue, result));
					} else {
						var _n2 = list.a;
						var lKey = _n2.a;
						var lValue = _n2.b;
						var rest = list.b;
						if (_Utils_cmp(lKey, rKey) < 0) {
							var $temp$rKey = rKey,
								$temp$rValue = rValue,
								$temp$_n0 = _Utils_Tuple2(
								rest,
								A3(leftStep, lKey, lValue, result));
							rKey = $temp$rKey;
							rValue = $temp$rValue;
							_n0 = $temp$_n0;
							continue stepState;
						} else {
							if (_Utils_cmp(lKey, rKey) > 0) {
								return _Utils_Tuple2(
									list,
									A3(rightStep, rKey, rValue, result));
							} else {
								return _Utils_Tuple2(
									rest,
									A4(bothStep, lKey, lValue, rValue, result));
							}
						}
					}
				}
			});
		var _n3 = A3(
			elm$core$Dict$foldl,
			stepState,
			_Utils_Tuple2(
				elm$core$Dict$toList(leftDict),
				initialResult),
			rightDict);
		var leftovers = _n3.a;
		var intermediateResult = _n3.b;
		return A3(
			elm$core$List$foldl,
			F2(
				function (_n4, result) {
					var k = _n4.a;
					var v = _n4.b;
					return A3(leftStep, k, v, result);
				}),
			intermediateResult,
			leftovers);
	});
var elm$core$Dict$union = F2(
	function (t1, t2) {
		return A3(elm$core$Dict$foldl, elm$core$Dict$insert, t2, t1);
	});
var elm$core$Process$kill = _Scheduler_kill;
var elm$browser$Browser$Events$onEffects = F3(
	function (router, subs, state) {
		var stepRight = F3(
			function (key, sub, _n6) {
				var deads = _n6.a;
				var lives = _n6.b;
				var news = _n6.c;
				return _Utils_Tuple3(
					deads,
					lives,
					A2(
						elm$core$List$cons,
						A3(elm$browser$Browser$Events$spawn, router, key, sub),
						news));
			});
		var stepLeft = F3(
			function (_n4, pid, _n5) {
				var deads = _n5.a;
				var lives = _n5.b;
				var news = _n5.c;
				return _Utils_Tuple3(
					A2(elm$core$List$cons, pid, deads),
					lives,
					news);
			});
		var stepBoth = F4(
			function (key, pid, _n2, _n3) {
				var deads = _n3.a;
				var lives = _n3.b;
				var news = _n3.c;
				return _Utils_Tuple3(
					deads,
					A3(elm$core$Dict$insert, key, pid, lives),
					news);
			});
		var newSubs = A2(elm$core$List$map, elm$browser$Browser$Events$addKey, subs);
		var _n0 = A6(
			elm$core$Dict$merge,
			stepLeft,
			stepBoth,
			stepRight,
			state.pids,
			elm$core$Dict$fromList(newSubs),
			_Utils_Tuple3(_List_Nil, elm$core$Dict$empty, _List_Nil));
		var deadPids = _n0.a;
		var livePids = _n0.b;
		var makeNewPids = _n0.c;
		return A2(
			elm$core$Task$andThen,
			function (pids) {
				return elm$core$Task$succeed(
					A2(
						elm$browser$Browser$Events$State,
						newSubs,
						A2(
							elm$core$Dict$union,
							livePids,
							elm$core$Dict$fromList(pids))));
			},
			A2(
				elm$core$Task$andThen,
				function (_n1) {
					return elm$core$Task$sequence(makeNewPids);
				},
				elm$core$Task$sequence(
					A2(elm$core$List$map, elm$core$Process$kill, deadPids))));
	});
var elm$browser$Browser$Events$onSelfMsg = F3(
	function (router, _n0, state) {
		var key = _n0.key;
		var event = _n0.event;
		var toMessage = function (_n2) {
			var subKey = _n2.a;
			var _n3 = _n2.b;
			var node = _n3.a;
			var name = _n3.b;
			var decoder = _n3.c;
			return _Utils_eq(subKey, key) ? A2(_Browser_decodeEvent, decoder, event) : elm$core$Maybe$Nothing;
		};
		var messages = A2(elm$core$List$filterMap, toMessage, state.subs);
		return A2(
			elm$core$Task$andThen,
			function (_n1) {
				return elm$core$Task$succeed(state);
			},
			elm$core$Task$sequence(
				A2(
					elm$core$List$map,
					elm$core$Platform$sendToApp(router),
					messages)));
	});
var elm$browser$Browser$Events$subMap = F2(
	function (func, _n0) {
		var node = _n0.a;
		var name = _n0.b;
		var decoder = _n0.c;
		return A3(
			elm$browser$Browser$Events$MySub,
			node,
			name,
			A2(elm$json$Json$Decode$map, func, decoder));
	});
_Platform_effectManagers['Browser.Events'] = _Platform_createManager(elm$browser$Browser$Events$init, elm$browser$Browser$Events$onEffects, elm$browser$Browser$Events$onSelfMsg, 0, elm$browser$Browser$Events$subMap);
var elm$browser$Browser$Events$subscription = _Platform_leaf('Browser.Events');
var elm$browser$Browser$Events$on = F3(
	function (node, name, decoder) {
		return elm$browser$Browser$Events$subscription(
			A3(elm$browser$Browser$Events$MySub, node, name, decoder));
	});
var elm$browser$Browser$Events$onKeyDown = A2(elm$browser$Browser$Events$on, elm$browser$Browser$Events$Document, 'keydown');
var elm$browser$Browser$Events$onKeyUp = A2(elm$browser$Browser$Events$on, elm$browser$Browser$Events$Document, 'keyup');
var elm$core$Platform$Sub$batch = _Platform_batch;
var elm$time$Time$Every = F2(
	function (a, b) {
		return {$: 'Every', a: a, b: b};
	});
var elm$time$Time$State = F2(
	function (taggers, processes) {
		return {processes: processes, taggers: taggers};
	});
var elm$time$Time$init = elm$core$Task$succeed(
	A2(elm$time$Time$State, elm$core$Dict$empty, elm$core$Dict$empty));
var elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === 'RBEmpty_elm_builtin') {
				return elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _n1 = A2(elm$core$Basics$compare, targetKey, key);
				switch (_n1.$) {
					case 'LT':
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 'EQ':
						return elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var elm$time$Time$addMySub = F2(
	function (_n0, state) {
		var interval = _n0.a;
		var tagger = _n0.b;
		var _n1 = A2(elm$core$Dict$get, interval, state);
		if (_n1.$ === 'Nothing') {
			return A3(
				elm$core$Dict$insert,
				interval,
				_List_fromArray(
					[tagger]),
				state);
		} else {
			var taggers = _n1.a;
			return A3(
				elm$core$Dict$insert,
				interval,
				A2(elm$core$List$cons, tagger, taggers),
				state);
		}
	});
var elm$core$Process$spawn = _Scheduler_spawn;
var elm$time$Time$setInterval = _Time_setInterval;
var elm$time$Time$spawnHelp = F3(
	function (router, intervals, processes) {
		if (!intervals.b) {
			return elm$core$Task$succeed(processes);
		} else {
			var interval = intervals.a;
			var rest = intervals.b;
			var spawnTimer = elm$core$Process$spawn(
				A2(
					elm$time$Time$setInterval,
					interval,
					A2(elm$core$Platform$sendToSelf, router, interval)));
			var spawnRest = function (id) {
				return A3(
					elm$time$Time$spawnHelp,
					router,
					rest,
					A3(elm$core$Dict$insert, interval, id, processes));
			};
			return A2(elm$core$Task$andThen, spawnRest, spawnTimer);
		}
	});
var elm$time$Time$onEffects = F3(
	function (router, subs, _n0) {
		var processes = _n0.processes;
		var rightStep = F3(
			function (_n6, id, _n7) {
				var spawns = _n7.a;
				var existing = _n7.b;
				var kills = _n7.c;
				return _Utils_Tuple3(
					spawns,
					existing,
					A2(
						elm$core$Task$andThen,
						function (_n5) {
							return kills;
						},
						elm$core$Process$kill(id)));
			});
		var newTaggers = A3(elm$core$List$foldl, elm$time$Time$addMySub, elm$core$Dict$empty, subs);
		var leftStep = F3(
			function (interval, taggers, _n4) {
				var spawns = _n4.a;
				var existing = _n4.b;
				var kills = _n4.c;
				return _Utils_Tuple3(
					A2(elm$core$List$cons, interval, spawns),
					existing,
					kills);
			});
		var bothStep = F4(
			function (interval, taggers, id, _n3) {
				var spawns = _n3.a;
				var existing = _n3.b;
				var kills = _n3.c;
				return _Utils_Tuple3(
					spawns,
					A3(elm$core$Dict$insert, interval, id, existing),
					kills);
			});
		var _n1 = A6(
			elm$core$Dict$merge,
			leftStep,
			bothStep,
			rightStep,
			newTaggers,
			processes,
			_Utils_Tuple3(
				_List_Nil,
				elm$core$Dict$empty,
				elm$core$Task$succeed(_Utils_Tuple0)));
		var spawnList = _n1.a;
		var existingDict = _n1.b;
		var killTask = _n1.c;
		return A2(
			elm$core$Task$andThen,
			function (newProcesses) {
				return elm$core$Task$succeed(
					A2(elm$time$Time$State, newTaggers, newProcesses));
			},
			A2(
				elm$core$Task$andThen,
				function (_n2) {
					return A3(elm$time$Time$spawnHelp, router, spawnList, existingDict);
				},
				killTask));
	});
var elm$time$Time$onSelfMsg = F3(
	function (router, interval, state) {
		var _n0 = A2(elm$core$Dict$get, interval, state.taggers);
		if (_n0.$ === 'Nothing') {
			return elm$core$Task$succeed(state);
		} else {
			var taggers = _n0.a;
			var tellTaggers = function (time) {
				return elm$core$Task$sequence(
					A2(
						elm$core$List$map,
						function (tagger) {
							return A2(
								elm$core$Platform$sendToApp,
								router,
								tagger(time));
						},
						taggers));
			};
			return A2(
				elm$core$Task$andThen,
				function (_n1) {
					return elm$core$Task$succeed(state);
				},
				A2(elm$core$Task$andThen, tellTaggers, elm$time$Time$now));
		}
	});
var elm$time$Time$subMap = F2(
	function (f, _n0) {
		var interval = _n0.a;
		var tagger = _n0.b;
		return A2(
			elm$time$Time$Every,
			interval,
			A2(elm$core$Basics$composeL, f, tagger));
	});
_Platform_effectManagers['Time'] = _Platform_createManager(elm$time$Time$init, elm$time$Time$onEffects, elm$time$Time$onSelfMsg, 0, elm$time$Time$subMap);
var elm$time$Time$subscription = _Platform_leaf('Time');
var elm$time$Time$every = F2(
	function (interval, tagger) {
		return elm$time$Time$subscription(
			A2(elm$time$Time$Every, interval, tagger));
	});
var author$project$Main$subscriptions = function (_n0) {
	return elm$core$Platform$Sub$batch(
		_List_fromArray(
			[
				author$project$Main$fromJs(author$project$Main$jsMsgToMsg),
				elm$browser$Browser$Events$onKeyDown(
				A2(elm$json$Json$Decode$map, author$project$Main$keydownToMsg, author$project$Main$keyDecoder)),
				elm$browser$Browser$Events$onKeyUp(
				A2(elm$json$Json$Decode$map, author$project$Main$keyupToMsg, author$project$Main$keyDecoder)),
				A2(
				elm$time$Time$every,
				20 * 1000,
				A2(elm$core$Basics$composeL, author$project$Main$NoJs, author$project$Main$SetCurrentDate))
			]));
};
var author$project$Main$UpdateGlobalCenterOfGravity = {$: 'UpdateGlobalCenterOfGravity'};
var author$project$EncodersDecoders$tuple2Encoder = F3(
	function (enc1, enc2, _n0) {
		var val1 = _n0.a;
		var val2 = _n0.b;
		return A2(
			elm$json$Json$Encode$list,
			elm$core$Basics$identity,
			_List_fromArray(
				[
					enc1(val1),
					enc2(val2)
				]));
	});
var author$project$EncodersDecoders$encodeHullSliceAsZYList = function (hsXY) {
	return elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'x',
				elm$json$Json$Encode$float(hsXY.x)),
				_Utils_Tuple2(
				'zylist',
				A2(
					elm$json$Json$Encode$list,
					A2(author$project$EncodersDecoders$tuple2Encoder, elm$json$Json$Encode$float, elm$json$Json$Encode$float),
					hsXY.zylist))
			]));
};
var author$project$EncodersDecoders$encodeSubModel = function (subModel) {
	return elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'xmin',
				elm$json$Json$Encode$float(subModel.xmin)),
				_Utils_Tuple2(
				'xmax',
				elm$json$Json$Encode$float(subModel.xmax)),
				_Utils_Tuple2(
				'hullSlices',
				A2(elm$json$Json$Encode$list, author$project$EncodersDecoders$encodeHullSliceAsZYList, subModel.hullSlices))
			]));
};
var author$project$EncodersDecoders$CustomPropertiesFloat = function (a) {
	return {$: 'CustomPropertiesFloat', a: a};
};
var author$project$EncodersDecoders$encodeMaybeFloatInput = function (_n0) {
	var name = _n0.a;
	var maybeVal = _n0.b;
	return A2(
		elm$core$Maybe$map,
		function (val) {
			return _Utils_Tuple2(
				name,
				author$project$EncodersDecoders$CustomPropertiesFloat(val));
		},
		maybeVal);
};
var author$project$EncodersDecoders$CustomPropertiesList = function (a) {
	return {$: 'CustomPropertiesList', a: a};
};
var author$project$EncodersDecoders$encodeMaybeListFloat = function (_n0) {
	var name = _n0.a;
	var maybeVal = _n0.b;
	return A2(
		elm$core$Maybe$map,
		function (val) {
			return _Utils_Tuple2(
				name,
				author$project$EncodersDecoders$CustomPropertiesList(val));
		},
		maybeVal);
};
var author$project$EncodersDecoders$customHullPropertiesList = function (hullSlices) {
	return _List_fromArray(
		[
			author$project$EncodersDecoders$encodeMaybeFloatInput(
			_Utils_Tuple2('length', hullSlices.custom.length)),
			author$project$EncodersDecoders$encodeMaybeFloatInput(
			_Utils_Tuple2('breadth', hullSlices.custom.breadth)),
			author$project$EncodersDecoders$encodeMaybeFloatInput(
			_Utils_Tuple2('depth', hullSlices.custom.depth)),
			author$project$EncodersDecoders$encodeMaybeFloatInput(
			_Utils_Tuple2('draught', hullSlices.custom.draught)),
			author$project$EncodersDecoders$encodeMaybeListFloat(
			_Utils_Tuple2('hullslicesPositions', hullSlices.custom.hullslicesPositions))
		]);
};
var author$project$EncodersDecoders$encodeCustomProperty = function (customProperty) {
	if (customProperty.$ === 'CustomPropertiesFloat') {
		var propertiesFloat = customProperty.a;
		return elm$json$Json$Encode$float(propertiesFloat.value);
	} else {
		var propertiesList = customProperty.a;
		return A2(elm$json$Json$Encode$list, elm$json$Json$Encode$float, propertiesList);
	}
};
var elm$core$Tuple$mapSecond = F2(
	function (func, _n0) {
		var x = _n0.a;
		var y = _n0.b;
		return _Utils_Tuple2(
			x,
			func(y));
	});
var author$project$EncodersDecoders$toKeyValue = elm$core$Tuple$mapSecond(author$project$EncodersDecoders$encodeCustomProperty);
var author$project$EncodersDecoders$encodeCustomProperties = function (hullSlices) {
	return elm$json$Json$Encode$object(
		A2(
			elm$core$List$filterMap,
			elm$core$Maybe$map(author$project$EncodersDecoders$toKeyValue),
			author$project$EncodersDecoders$customHullPropertiesList(hullSlices)));
};
var author$project$EncodersDecoders$hullSliceEncoder = function (hullSlice) {
	return elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'x',
				elm$json$Json$Encode$float(hullSlice.x)),
				_Utils_Tuple2(
				'zmin',
				elm$json$Json$Encode$float(hullSlice.zmin)),
				_Utils_Tuple2(
				'zmax',
				elm$json$Json$Encode$float(hullSlice.zmax)),
				_Utils_Tuple2(
				'y',
				A2(elm$json$Json$Encode$list, elm$json$Json$Encode$float, hullSlice.y))
			]));
};
var author$project$EncodersDecoders$encoder = function (hullSlices) {
	return elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'length',
				elm$json$Json$Encode$float(hullSlices.length.value)),
				_Utils_Tuple2(
				'breadth',
				elm$json$Json$Encode$float(hullSlices.breadth.value)),
				_Utils_Tuple2(
				'depth',
				elm$json$Json$Encode$float(hullSlices.depth.value)),
				_Utils_Tuple2(
				'draught',
				elm$json$Json$Encode$float(hullSlices.draught.value)),
				_Utils_Tuple2(
				'xmin',
				elm$json$Json$Encode$float(hullSlices.xmin)),
				_Utils_Tuple2(
				'zmin',
				elm$json$Json$Encode$float(hullSlices.zmin)),
				_Utils_Tuple2(
				'slices',
				A2(elm$json$Json$Encode$list, author$project$EncodersDecoders$hullSliceEncoder, hullSlices.slices)),
				_Utils_Tuple2(
				'custom',
				author$project$EncodersDecoders$encodeCustomProperties(hullSlices))
			]));
};
var author$project$EncodersDecoders$encoderWithSelectedSlice = F3(
	function (selectedSlice, showSelectedSlice, hullSlices) {
		return elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'hullSlices',
					author$project$EncodersDecoders$encoder(hullSlices)),
					_Utils_Tuple2(
					'selectedSlice',
					elm$json$Json$Encode$int(selectedSlice)),
					_Utils_Tuple2(
					'showSelectedSlice',
					elm$json$Json$Encode$bool(showSelectedSlice))
				]));
	});
var elm$core$Tuple$second = function (_n0) {
	var y = _n0.b;
	return y;
};
var author$project$HullSlices$extractY = function (hs) {
	return A2(elm$core$List$map, elm$core$Tuple$second, hs.zylist);
};
var author$project$HullSlices$integrate = function (l) {
	if (!l.b) {
		return 0;
	} else {
		if (!l.b.b) {
			return 0;
		} else {
			var _n1 = l.a;
			var x1 = _n1.a;
			var y1 = _n1.b;
			var _n2 = l.b;
			var _n3 = _n2.a;
			var x2 = _n3.a;
			var y2 = _n3.b;
			var rest = _n2.b;
			return (((x2 - x1) * (y1 + y2)) / 2) + author$project$HullSlices$integrate(
				A2(
					elm$core$List$cons,
					_Utils_Tuple2(x2, y2),
					rest));
		}
	}
};
var elm$core$Array$fromListHelp = F3(
	function (list, nodeList, nodeListSize) {
		fromListHelp:
		while (true) {
			var _n0 = A2(elm$core$Elm$JsArray$initializeFromList, elm$core$Array$branchFactor, list);
			var jsArray = _n0.a;
			var remainingItems = _n0.b;
			if (_Utils_cmp(
				elm$core$Elm$JsArray$length(jsArray),
				elm$core$Array$branchFactor) < 0) {
				return A2(
					elm$core$Array$builderToArray,
					true,
					{nodeList: nodeList, nodeListSize: nodeListSize, tail: jsArray});
			} else {
				var $temp$list = remainingItems,
					$temp$nodeList = A2(
					elm$core$List$cons,
					elm$core$Array$Leaf(jsArray),
					nodeList),
					$temp$nodeListSize = nodeListSize + 1;
				list = $temp$list;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue fromListHelp;
			}
		}
	});
var elm$core$Array$fromList = function (list) {
	if (!list.b) {
		return elm$core$Array$empty;
	} else {
		return A3(elm$core$Array$fromListHelp, list, _List_Nil, 0);
	}
};
var elm$core$Array$toIndexedList = function (array) {
	var len = array.a;
	var helper = F2(
		function (entry, _n0) {
			var index = _n0.a;
			var list = _n0.b;
			return _Utils_Tuple2(
				index - 1,
				A2(
					elm$core$List$cons,
					_Utils_Tuple2(index, entry),
					list));
		});
	return A3(
		elm$core$Array$foldr,
		helper,
		_Utils_Tuple2(len - 1, _List_Nil),
		array).b;
};
var author$project$HullSlices$toHullSliceAsZYList = function (hs) {
	var zmin = hs.zmin;
	var zmax = hs.zmax;
	var y = hs.y;
	var dz = (zmax - zmin) / A2(
		elm$core$Basics$max,
		1,
		elm$core$List$length(y) - 1);
	var acc = function (_n0) {
		var idx = _n0.a;
		var y_ = _n0.b;
		return _Utils_Tuple2(zmin + (idx * dz), y_);
	};
	var lst = A2(
		elm$core$List$map,
		acc,
		elm$core$Array$toIndexedList(
			elm$core$Array$fromList(y)));
	return {x: hs.x, zylist: lst};
};
var author$project$HullSlicesMetrics$getDenormalizedSlices = function (hullSlicesMetrics) {
	var hs = function () {
		var hs_ = hullSlicesMetrics.a;
		return hs_;
	}();
	return hs.denormalizedSlices;
};
var author$project$HullSlicesMetrics$getLength = function (hullSlicesMetrics) {
	var hs = function () {
		var hs_ = hullSlicesMetrics.a;
		return hs_;
	}();
	return hs.length;
};
var author$project$HullSlicesMetrics$getXmin = function (hullSlicesMetrics) {
	var hs = function () {
		var hs_ = hullSlicesMetrics.a;
		return hs_;
	}();
	return hs.xmin;
};
var elm$core$List$maximum = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return elm$core$Maybe$Just(
			A3(elm$core$List$foldl, elm$core$Basics$max, x, xs));
	} else {
		return elm$core$Maybe$Nothing;
	}
};
var elm$core$Basics$min = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) < 0) ? x : y;
	});
var elm$core$List$minimum = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return elm$core$Maybe$Just(
			A3(elm$core$List$foldl, elm$core$Basics$min, x, xs));
	} else {
		return elm$core$Maybe$Nothing;
	}
};
var author$project$HullSlicesMetrics$intersectBelow = F2(
	function (z0, hullSlices) {
		var xMinAtZ = F2(
			function (xmin_, listHS_) {
				xMinAtZ:
				while (true) {
					if (listHS_.b) {
						var hs = listHS_.a;
						var xs = listHS_.b;
						if (_Utils_cmp(hs.zmax, z0) < 1) {
							var $temp$xmin_ = hs.x,
								$temp$listHS_ = xs;
							xmin_ = $temp$xmin_;
							listHS_ = $temp$listHS_;
							continue xMinAtZ;
						} else {
							return xmin_;
						}
					} else {
						return xmin_;
					}
				}
			});
		var xmin = A3(
			elm$core$Basics$apL,
			xMinAtZ,
			author$project$HullSlicesMetrics$getXmin(hullSlices),
			author$project$HullSlicesMetrics$getDenormalizedSlices(hullSlices));
		var xMaxAtZ = F2(
			function (xmax_, listHS_) {
				xMaxAtZ:
				while (true) {
					if (listHS_.b) {
						var hs = listHS_.a;
						var xs = listHS_.b;
						if (_Utils_cmp(hs.zmax, z0) < 1) {
							var $temp$xmax_ = hs.x,
								$temp$listHS_ = xs;
							xmax_ = $temp$xmax_;
							listHS_ = $temp$listHS_;
							continue xMaxAtZ;
						} else {
							return xmax_;
						}
					} else {
						return xmax_;
					}
				}
			});
		var xmax = A2(
			xMaxAtZ,
			author$project$HullSlicesMetrics$getXmin(hullSlices) + author$project$HullSlicesMetrics$getLength(hullSlices).value,
			elm$core$List$reverse(
				author$project$HullSlicesMetrics$getDenormalizedSlices(hullSlices)));
		var toXY_ = function (hs) {
			var zmin = hs.zmin;
			var zmax = hs.zmax;
			var y = hs.y;
			var dz = (zmax - zmin) / A2(
				elm$core$Basics$max,
				1,
				elm$core$List$length(y) - 1);
			var acc = function (_n8) {
				var idx = _n8.a;
				var y_ = _n8.b;
				return _Utils_Tuple2(zmin + (idx * dz), y_);
			};
			var lst = A2(
				elm$core$List$map,
				acc,
				elm$core$Array$toIndexedList(
					elm$core$Array$fromList(y)));
			return {x: hs.x, zylist: lst};
		};
		var getInterpolateValuesAndSubList = function (list) {
			var filterL = F2(
				function (z, lst) {
					filterL:
					while (true) {
						if (lst.b && lst.b.b) {
							var _n5 = lst.a;
							var z1 = _n5.a;
							var y1 = _n5.b;
							var _n6 = lst.b;
							var _n7 = _n6.a;
							var z2 = _n7.a;
							var y2 = _n7.b;
							var rest = _n6.b;
							if ((_Utils_cmp(z, z2) < 0) && (_Utils_cmp(z, z1) > -1)) {
								var k = (z - z1) / (z2 - z1);
								var y = ((1 - k) * y1) + (k * y2);
								return A2(
									elm$core$List$cons,
									_Utils_Tuple2(z, y),
									A2(
										elm$core$List$cons,
										_Utils_Tuple2(z2, y2),
										rest));
							} else {
								var $temp$z = z,
									$temp$lst = A2(
									elm$core$List$cons,
									_Utils_Tuple2(z2, y2),
									rest);
								z = $temp$z;
								lst = $temp$lst;
								continue filterL;
							}
						} else {
							return _List_Nil;
						}
					}
				});
			var subList = A2(filterL, z0, list);
			return subList;
		};
		var filterHS = A2(
			elm$core$List$filter,
			function (u) {
				return (_Utils_cmp(u.zmax, z0) > 0) && (!elm$core$List$isEmpty(u.y));
			},
			author$project$HullSlicesMetrics$getDenormalizedSlices(hullSlices));
		var lhsXY = A2(elm$core$List$map, author$project$HullSlices$toHullSliceAsZYList, filterHS);
		var extractZYAtZ_ = function (list) {
			var maybeZmin = elm$core$List$minimum(
				A2(elm$core$List$map, elm$core$Tuple$first, list));
			var maybeZmax = elm$core$List$maximum(
				A2(elm$core$List$map, elm$core$Tuple$first, list));
			if (maybeZmax.$ === 'Nothing') {
				return _List_Nil;
			} else {
				var zmax = maybeZmax.a;
				if (_Utils_cmp(z0, zmax) > 0) {
					return _List_Nil;
				} else {
					if (maybeZmin.$ === 'Nothing') {
						return _List_Nil;
					} else {
						var zmin = maybeZmin.a;
						return (_Utils_cmp(z0, zmin) < 0) ? list : getInterpolateValuesAndSubList(list);
					}
				}
			}
		};
		var extractZYAtZ = function (hsXY) {
			return {
				x: hsXY.x,
				zylist: extractZYAtZ_(hsXY.zylist)
			};
		};
		var lhsXY_AtZ = A2(elm$core$List$map, extractZYAtZ, lhsXY);
		return {hullSlices: lhsXY_AtZ, xmax: xmax, xmin: xmin};
	});
var author$project$HullSlicesMetrics$extractHorizontalSliceAtZ = F2(
	function (z0, hullSlices) {
		var hullSlicesBelowZ0 = A2(author$project$HullSlicesMetrics$intersectBelow, z0, hullSlices);
		var extractFirstXY = function (hullSliceAsZYList) {
			return _Utils_Tuple2(
				hullSliceAsZYList.x,
				A2(
					elm$core$Maybe$withDefault,
					0,
					elm$core$List$head(
						author$project$HullSlices$extractY(hullSliceAsZYList))));
		};
		var xy_ = A2(elm$core$List$map, extractFirstXY, hullSlicesBelowZ0.hullSlices);
		var area_ = author$project$HullSlices$integrate(xy_);
		return {area: area_, xy: xy_, z: z0};
	});
var author$project$HullSlicesMetrics$HullSlicesMetrics = function (a) {
	return {$: 'HullSlicesMetrics', a: a};
};
var elm$core$Basics$abs = function (n) {
	return (n < 0) ? (-n) : n;
};
var author$project$HullSlices$areaTrapezoid = F2(
	function (_n0, _n1) {
		var z1 = _n0.a;
		var y1 = _n0.b;
		var z2 = _n1.a;
		var y2 = _n1.b;
		var c = elm$core$Basics$abs(z2 - z1);
		var b = elm$core$Basics$abs(y2);
		var a = elm$core$Basics$abs(y1);
		return (0.5 * (a + b)) * c;
	});
var author$project$HullSlices$zTrapezoid = F2(
	function (_n0, _n1) {
		var z1 = _n0.a;
		var y1 = _n0.b;
		var z2 = _n1.a;
		var y2 = _n1.b;
		var z = (z1 + z2) / 2.0;
		var area_ = A2(
			author$project$HullSlices$areaTrapezoid,
			_Utils_Tuple2(z1, y1),
			_Utils_Tuple2(z2, y2));
		return z * area_;
	});
var author$project$HullSlicesMetrics$addCentroidAreaForEachImmersedSlice = function (hullSlicesMetrics) {
	var integrateTrapezoidMetricOnSlices = F2(
		function (trapezoidMetric, denormalizedSlices) {
			if (denormalizedSlices.b && denormalizedSlices.b.b) {
				var _n1 = denormalizedSlices.a;
				var z1 = _n1.a;
				var y1 = _n1.b;
				var _n2 = denormalizedSlices.b;
				var _n3 = _n2.a;
				var z2 = _n3.a;
				var y2 = _n3.b;
				var rest = _n2.b;
				return A2(
					trapezoidMetric,
					_Utils_Tuple2(z1, y1),
					_Utils_Tuple2(z2, y2)) + A2(
					integrateTrapezoidMetricOnSlices,
					trapezoidMetric,
					A2(
						elm$core$List$cons,
						_Utils_Tuple2(z2, y2),
						rest));
			} else {
				return 0;
			}
		});
	var calculateCentroidArea = function (hullSliceAsZYList) {
		var area_ = 2 * A2(integrateTrapezoidMetricOnSlices, author$project$HullSlices$areaTrapezoid, hullSliceAsZYList.zylist);
		var centroid_ = (area_ === 0.0) ? 0 : (A2(integrateTrapezoidMetricOnSlices, author$project$HullSlices$zTrapezoid, hullSliceAsZYList.zylist) / area_);
		return {area: area_, centroid: centroid_, x: hullSliceAsZYList.x};
	};
	return _Utils_update(
		hullSlicesMetrics,
		{
			centroidAreaForEachImmersedSlice: A2(elm$core$List$map, calculateCentroidArea, hullSlicesMetrics.hullSlicesBeneathFreeSurface.hullSlices)
		});
};
var author$project$HullSlices$denormalizeHullSlice = F2(
	function (param, hs) {
		var x = (hs.x * param.length) + param.xmin;
		var denormalizedZ = F3(
			function (zmin, depth, z) {
				return (z * depth) + zmin;
			});
		var hs_zmax = A3(denormalizedZ, param.zmin, param.depth, hs.zmax);
		var hs_zmin = A3(denormalizedZ, param.zmin, param.depth, hs.zmin);
		var denormalizedY = F2(
			function (br, y) {
				return (y * br) + ((-br) / 2);
			});
		var hs_y = A2(
			elm$core$List$map,
			denormalizedY(param.breadth),
			hs.y);
		var res = {x: x, y: hs_y, zmax: hs_zmax, zmin: hs_zmin};
		return res;
	});
var author$project$HullSlices$denormalizeHullSlices = F2(
	function (param, l) {
		return A2(
			elm$core$List$map,
			author$project$HullSlices$denormalizeHullSlice(param),
			l);
	});
var author$project$HullSlicesMetrics$addDenormalizedSlices = function (hullSlicesMetrics) {
	var denormalizedSlices = A2(
		author$project$HullSlices$denormalizeHullSlices,
		{breadth: hullSlicesMetrics.breadth.value, depth: hullSlicesMetrics.depth.value, length: hullSlicesMetrics.length.value, xmin: hullSlicesMetrics.xmin, zmin: hullSlicesMetrics.zmin},
		hullSlicesMetrics.slices);
	return _Utils_update(
		hullSlicesMetrics,
		{denormalizedSlices: denormalizedSlices});
};
var author$project$HullSlices$volume = function (lo) {
	if (lo.b && lo.b.b) {
		var o1 = lo.a;
		var _n1 = lo.b;
		var o2 = _n1.a;
		var rest = _n1.b;
		var x2 = o2.x;
		var x1 = o1.x;
		var a2 = o2.area;
		var a1 = o1.area;
		var value = elm$core$Basics$abs(((a1 + a2) / 2.0) * (x2 - x1));
		return value + author$project$HullSlices$volume(
			A2(elm$core$List$cons, o2, rest));
	} else {
		return 0;
	}
};
var author$project$HullSlicesMetrics$addDisplacement = function (hullSlicesMetrics) {
	return _Utils_update(
		hullSlicesMetrics,
		{
			displacement: author$project$HullSlices$volume(hullSlicesMetrics.centroidAreaForEachImmersedSlice)
		});
};
var elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3(elm$core$List$foldr, elm$core$List$cons, ys, xs);
		}
	});
var elm$core$List$concat = function (lists) {
	return A3(elm$core$List$foldr, elm$core$List$append, _List_Nil, lists);
};
var author$project$HullSlicesMetrics$addExtremePoints = function (hullSlicesMetrics) {
	var xmin = hullSlicesMetrics.hullSlicesBeneathFreeSurface.xmin;
	var xminAreaCurve = A2(
		elm$core$Maybe$withDefault,
		xmin,
		elm$core$List$minimum(
			A2(
				elm$core$List$map,
				function ($) {
					return $.x;
				},
				hullSlicesMetrics.centroidAreaForEachImmersedSlice)));
	var xmax = hullSlicesMetrics.hullSlicesBeneathFreeSurface.xmax;
	var xmaxAreaCurve = A2(
		elm$core$Maybe$withDefault,
		xmax,
		elm$core$List$maximum(
			A2(
				elm$core$List$map,
				function ($) {
					return $.x;
				},
				hullSlicesMetrics.centroidAreaForEachImmersedSlice)));
	var centroidAndAreaWithEndpointsAtZero = function () {
		var _n0 = _Utils_Tuple2(
			_Utils_eq(xminAreaCurve, xmin),
			_Utils_eq(xmaxAreaCurve, xmax));
		if (!_n0.a) {
			if (!_n0.b) {
				return elm$core$List$concat(
					_List_fromArray(
						[
							_List_fromArray(
							[
								{area: 0.0, centroid: 0, x: xmin}
							]),
							hullSlicesMetrics.centroidAreaForEachImmersedSlice,
							_List_fromArray(
							[
								{area: 0.0, centroid: 0, x: xmax}
							])
						]));
			} else {
				return elm$core$List$concat(
					_List_fromArray(
						[
							_List_fromArray(
							[
								{area: 0.0, centroid: 0, x: xmin}
							]),
							hullSlicesMetrics.centroidAreaForEachImmersedSlice
						]));
			}
		} else {
			if (!_n0.b) {
				return elm$core$List$concat(
					_List_fromArray(
						[
							hullSlicesMetrics.centroidAreaForEachImmersedSlice,
							_List_fromArray(
							[
								{area: 0.0, centroid: 0, x: xmax}
							])
						]));
			} else {
				return hullSlicesMetrics.centroidAreaForEachImmersedSlice;
			}
		}
	}();
	return _Utils_update(
		hullSlicesMetrics,
		{centroidAreaForEachImmersedSlice: centroidAndAreaWithEndpointsAtZero});
};
var author$project$HullSlicesMetrics$addHullSlicesBeneathFreeSurface = function (hullSlicesMetrics) {
	var zAtDraught = (hullSlicesMetrics.zmin + hullSlicesMetrics.depth.value) - hullSlicesMetrics.draught.value;
	var hullSlicesBeneathFreeSurface = A2(
		author$project$HullSlicesMetrics$intersectBelow,
		zAtDraught,
		author$project$HullSlicesMetrics$HullSlicesMetrics(hullSlicesMetrics));
	return _Utils_update(
		hullSlicesMetrics,
		{hullSlicesBeneathFreeSurface: hullSlicesBeneathFreeSurface});
};
var author$project$HullSlicesMetrics$addAreaAndDisplacement = function (hullSlicesMetrics) {
	return author$project$HullSlicesMetrics$addDisplacement(
		author$project$HullSlicesMetrics$addExtremePoints(
			author$project$HullSlicesMetrics$addCentroidAreaForEachImmersedSlice(
				author$project$HullSlicesMetrics$addHullSlicesBeneathFreeSurface(
					author$project$HullSlicesMetrics$addDenormalizedSlices(hullSlicesMetrics)))));
};
var author$project$HullSlices$blockVolume = function (o) {
	var yMinAllSlices = function (list) {
		var yminHullSlice = function (hsXY) {
			return elm$core$List$minimum(
				author$project$HullSlices$extractY(hsXY));
		};
		return elm$core$List$minimum(
			A2(
				elm$core$List$filterMap,
				elm$core$Basics$identity,
				A2(elm$core$List$map, yminHullSlice, list)));
	};
	var yMaxAllSlices = function (list) {
		var ymaxHullSlice = function (hsXY) {
			return elm$core$List$maximum(
				author$project$HullSlices$extractY(hsXY));
		};
		return elm$core$List$maximum(
			A2(
				elm$core$List$filterMap,
				elm$core$Basics$identity,
				A2(elm$core$List$map, ymaxHullSlice, list)));
	};
	var maybeYmin = yMinAllSlices(o.hullSlices);
	var maybeYmax = yMaxAllSlices(o.hullSlices);
	var extractZ = function (hsXY) {
		return A2(elm$core$List$map, elm$core$Tuple$first, hsXY.zylist);
	};
	var zMaxAllSlices = function (list) {
		var zmaxHullSlice = function (hsXY) {
			return elm$core$List$maximum(
				extractZ(hsXY));
		};
		return elm$core$List$maximum(
			A2(
				elm$core$List$filterMap,
				elm$core$Basics$identity,
				A2(elm$core$List$map, zmaxHullSlice, list)));
	};
	var maybeZmax = zMaxAllSlices(o.hullSlices);
	var zMinAllSlices = function (list) {
		var zminHullSlice = function (hsXY) {
			return elm$core$List$minimum(
				extractZ(hsXY));
		};
		return elm$core$List$minimum(
			A2(
				elm$core$List$filterMap,
				elm$core$Basics$identity,
				A2(elm$core$List$map, zminHullSlice, list)));
	};
	var maybeZmin = zMinAllSlices(o.hullSlices);
	var res = function () {
		var _n0 = _Utils_Tuple2(maybeZmin, maybeZmax);
		if ((_n0.a.$ === 'Just') && (_n0.b.$ === 'Just')) {
			var zm = _n0.a.a;
			var zM = _n0.b.a;
			var _n1 = _Utils_Tuple2(maybeYmin, maybeYmax);
			if ((_n1.a.$ === 'Just') && (_n1.b.$ === 'Just')) {
				var ym = _n1.a.a;
				var yM = _n1.b.a;
				return ((o.xmax - o.xmin) * (yM - ym)) * (zM - zm);
			} else {
				return 0;
			}
		} else {
			return 0;
		}
	}();
	return res;
};
var author$project$HullSlicesMetrics$addBlockCoefficient = function (hullSlicesMetrics) {
	var blockVolume_ = author$project$HullSlices$blockVolume(hullSlicesMetrics.hullSlicesBeneathFreeSurface);
	var blockCoefficient = (blockVolume_ === 0.0) ? 0.0 : ((hullSlicesMetrics.displacement / 2) / blockVolume_);
	return _Utils_update(
		hullSlicesMetrics,
		{blockCoefficient: blockCoefficient});
};
var author$project$HullSlices$calculateCentroid = function (lo) {
	if (lo.b && lo.b.b) {
		var o1 = lo.a;
		var _n1 = lo.b;
		var o2 = _n1.a;
		var rest = _n1.b;
		var z2 = o2.centroid;
		var z1 = o1.centroid;
		var x2 = o2.x;
		var x1 = o1.x;
		var a2 = o2.area;
		var a1 = o1.area;
		var value = (((a1 * z1) + (a2 * z2)) / 2.0) * (x2 - x1);
		return value + author$project$HullSlices$calculateCentroid(
			A2(elm$core$List$cons, o2, rest));
	} else {
		return 0;
	}
};
var author$project$HullSlicesMetrics$addCentreOfBuoyancy = function (hullSlicesMetrics) {
	var hullCentroid = author$project$HullSlices$calculateCentroid(hullSlicesMetrics.centroidAreaForEachImmersedSlice);
	var centreOfBuoyancy = (hullSlicesMetrics.displacement === 0.0) ? 0.0 : ((hullSlicesMetrics.zmin + hullSlicesMetrics.depth.value) - (hullCentroid / (hullSlicesMetrics.displacement / 2)));
	return _Utils_update(
		hullSlicesMetrics,
		{centreOfBuoyancy: centreOfBuoyancy});
};
var author$project$HullSlices$getInertialMoment = function (o) {
	var ys = A2(elm$core$List$map, elm$core$Tuple$second, o.xy);
	var xs = A2(elm$core$List$map, elm$core$Tuple$first, o.xy);
	var maybeXmin = elm$core$List$minimum(xs);
	var maybeXmax = elm$core$List$maximum(xs);
	var listLength = elm$core$List$length(ys);
	var inertialMoment = function () {
		var _n0 = _Utils_Tuple2(maybeXmin, maybeXmax);
		if ((_n0.a.$ === 'Just') && (_n0.b.$ === 'Just')) {
			var xmin = _n0.a.a;
			var xmax = _n0.b.a;
			var sumOfCubes = A3(
				elm$core$List$foldr,
				elm$core$Basics$add,
				0.0,
				A2(
					elm$core$List$map,
					function (u) {
						return (u * u) * u;
					},
					ys));
			return (!listLength) ? 0 : ((((2 / 3) * (xmax - xmin)) * sumOfCubes) / listLength);
		} else {
			return 0;
		}
	}();
	return inertialMoment;
};
var author$project$HullSlicesMetrics$addMetacentre = function (hullSlicesMetrics) {
	var zAtDraught = (hullSlicesMetrics.zmin + hullSlicesMetrics.depth.value) - hullSlicesMetrics.draught.value;
	var horizontalHullSliceAtDraught = A2(
		author$project$HullSlicesMetrics$extractHorizontalSliceAtZ,
		zAtDraught,
		author$project$HullSlicesMetrics$HullSlicesMetrics(hullSlicesMetrics));
	var inertialMoment_ = author$project$HullSlices$getInertialMoment(horizontalHullSliceAtDraught);
	var bM = (hullSlicesMetrics.displacement === 0.0) ? 0.0 : (inertialMoment_ / hullSlicesMetrics.displacement);
	var metacentre = hullSlicesMetrics.centreOfBuoyancy + bM;
	return _Utils_update(
		hullSlicesMetrics,
		{metacentre: metacentre});
};
var author$project$HullSlicesMetrics$getCentroidAreaForEachImmersedSlice = function (hullSlicesMetrics) {
	var hs = function () {
		var hs_ = hullSlicesMetrics.a;
		return hs_;
	}();
	return hs.centroidAreaForEachImmersedSlice;
};
var elm_community$list_extra$List$Extra$maximumBy = F2(
	function (f, ls) {
		var maxBy = F2(
			function (x, _n1) {
				var y = _n1.a;
				var fy = _n1.b;
				var fx = f(x);
				return (_Utils_cmp(fx, fy) > 0) ? _Utils_Tuple2(x, fx) : _Utils_Tuple2(y, fy);
			});
		if (ls.b) {
			if (!ls.b.b) {
				var l_ = ls.a;
				return elm$core$Maybe$Just(l_);
			} else {
				var l_ = ls.a;
				var ls_ = ls.b;
				return elm$core$Maybe$Just(
					A3(
						elm$core$List$foldl,
						maxBy,
						_Utils_Tuple2(
							l_,
							f(l_)),
						ls_).a);
			}
		} else {
			return elm$core$Maybe$Nothing;
		}
	});
var author$project$HullSlicesMetrics$getMasterCrossSection = function (hullSlicesMetrics) {
	return A2(
		elm_community$list_extra$List$Extra$maximumBy,
		function ($) {
			return $.area;
		},
		author$project$HullSlicesMetrics$getCentroidAreaForEachImmersedSlice(hullSlicesMetrics));
};
var elm$core$Maybe$andThen = F2(
	function (callback, maybeValue) {
		if (maybeValue.$ === 'Just') {
			var value = maybeValue.a;
			return callback(value);
		} else {
			return elm$core$Maybe$Nothing;
		}
	});
var author$project$HullSlicesMetrics$computePrismaticCoefficient = function (hullSlicesMetrics) {
	var lengthAtWaterline = hullSlicesMetrics.hullSlicesBeneathFreeSurface.xmax - hullSlicesMetrics.hullSlicesBeneathFreeSurface.xmin;
	var displacement = hullSlicesMetrics.displacement;
	var masterCrossSectionArea2PrismaticCoefficient = function (masterCrossSection) {
		return (!(lengthAtWaterline * masterCrossSection.area)) ? elm$core$Maybe$Nothing : elm$core$Maybe$Just(displacement / (lengthAtWaterline * masterCrossSection.area));
	};
	return A2(
		elm$core$Maybe$andThen,
		masterCrossSectionArea2PrismaticCoefficient,
		author$project$HullSlicesMetrics$getMasterCrossSection(
			author$project$HullSlicesMetrics$HullSlicesMetrics(hullSlicesMetrics)));
};
var author$project$StringValueInput$asFloatIn = F2(
	function (input, value) {
		return _Utils_update(
			input,
			{
				string: elm$core$String$fromFloat(value),
				value: value
			});
	});
var author$project$HullSlicesMetrics$initializePrismaticCoefficient = function (hullSlicesMetrics) {
	var p = {description: 'Prismatic coefficient', nbOfDigits: 2, string: '', unit: '-', value: 0};
	var maybePrismatic = author$project$HullSlicesMetrics$computePrismaticCoefficient(hullSlicesMetrics);
	if (maybePrismatic.$ === 'Nothing') {
		return _Utils_update(
			hullSlicesMetrics,
			{prismaticCoefficient: p});
	} else {
		var coeff = maybePrismatic.a;
		return _Utils_update(
			hullSlicesMetrics,
			{
				prismaticCoefficient: A2(
					author$project$StringValueInput$asFloatIn,
					p,
					A2(author$project$StringValueInput$round_n, 2, coeff))
			});
	}
};
var author$project$HullSlices$getBreadth = function (hullSlices) {
	return A2(elm$core$Maybe$withDefault, hullSlices.breadth, hullSlices.custom.breadth);
};
var author$project$HullSlices$getDepth = function (hullSlices) {
	return A2(elm$core$Maybe$withDefault, hullSlices.depth, hullSlices.custom.depth);
};
var author$project$HullSlices$getDraught = function (hullSlices) {
	return A2(elm$core$Maybe$withDefault, hullSlices.draught, hullSlices.custom.draught);
};
var author$project$HullSlices$getLength = function (hullSlices) {
	return A2(elm$core$Maybe$withDefault, hullSlices.length, hullSlices.custom.length);
};
var author$project$HullSlices$setLongitudinalPositionOfEachSlice = function (hullSlices) {
	var shiftSliceLongitudinalPosition = F2(
		function (slice, newX) {
			return _Utils_update(
				slice,
				{x: newX});
		});
	var _n0 = hullSlices.custom.hullslicesPositions;
	if (_n0.$ === 'Just') {
		var customPosition = _n0.a;
		return A3(elm$core$List$map2, shiftSliceLongitudinalPosition, hullSlices.slices, customPosition);
	} else {
		return hullSlices.slices;
	}
};
var author$project$HullSlicesMetrics$toHullSlicesMetrics = function (hullSlices) {
	return {
		blockCoefficient: 0,
		breadth: author$project$HullSlices$getBreadth(hullSlices),
		centreOfBuoyancy: 0,
		centroidAreaForEachImmersedSlice: _List_Nil,
		denormalizedSlices: _List_Nil,
		depth: author$project$HullSlices$getDepth(hullSlices),
		displacement: 0,
		draught: author$project$HullSlices$getDraught(hullSlices),
		hullSlicesBeneathFreeSurface: {hullSlices: _List_Nil, xmax: 0, xmin: 0},
		length: author$project$HullSlices$getLength(hullSlices),
		metacentre: 0,
		prismaticCoefficient: author$project$StringValueInput$emptyFloat(1),
		slices: author$project$HullSlices$setLongitudinalPositionOfEachSlice(hullSlices),
		xmin: hullSlices.xmin,
		zmin: hullSlices.zmin
	};
};
var author$project$HullSlicesMetrics$fillHullSliceMetrics = function (hullSlices) {
	return author$project$HullSlicesMetrics$HullSlicesMetrics(
		author$project$HullSlicesMetrics$initializePrismaticCoefficient(
			author$project$HullSlicesMetrics$addMetacentre(
				author$project$HullSlicesMetrics$addBlockCoefficient(
					author$project$HullSlicesMetrics$addCentreOfBuoyancy(
						author$project$HullSlicesMetrics$addAreaAndDisplacement(
							author$project$HullSlicesMetrics$toHullSlicesMetrics(hullSlices)))))));
};
var author$project$EncodersDecoders$exportHullSlicesAsAreaXYList = F2(
	function (config, hullSlices) {
		var horizontalSlices = A2(
			elm$core$List$map,
			function (z) {
				return A2(
					author$project$HullSlicesMetrics$extractHorizontalSliceAtZ,
					z,
					author$project$HullSlicesMetrics$fillHullSliceMetrics(hullSlices));
			},
			config.ldecks);
		return horizontalSlices;
	});
var author$project$EncodersDecoders$hullSliceAsAreaXYListEncoder = function (hsXY) {
	return elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'z',
				elm$json$Json$Encode$float(hsXY.z)),
				_Utils_Tuple2(
				'xy',
				A2(
					elm$json$Json$Encode$list,
					A2(author$project$EncodersDecoders$tuple2Encoder, elm$json$Json$Encode$float, elm$json$Json$Encode$float),
					hsXY.xy)),
				_Utils_Tuple2(
				'area',
				elm$json$Json$Encode$float(hsXY.area))
			]));
};
var author$project$HullSlices$applyCustomPropertiesToHullSlices = function (hullSlices) {
	return {
		breadth: author$project$HullSlices$getBreadth(hullSlices),
		custom: {breadth: elm$core$Maybe$Nothing, depth: elm$core$Maybe$Nothing, draught: elm$core$Maybe$Nothing, hullslicesPositions: elm$core$Maybe$Nothing, length: elm$core$Maybe$Nothing},
		depth: author$project$HullSlices$getDepth(hullSlices),
		draught: author$project$HullSlices$getDraught(hullSlices),
		length: author$project$HullSlices$getLength(hullSlices),
		originalSlicePositions: A2(
			elm$core$List$map,
			function ($) {
				return $.x;
			},
			author$project$HullSlices$setLongitudinalPositionOfEachSlice(hullSlices)),
		slices: author$project$HullSlices$setLongitudinalPositionOfEachSlice(hullSlices),
		xmin: hullSlices.xmin,
		zmin: hullSlices.zmin
	};
};
var author$project$Main$asXInPosition = F2(
	function (position, x) {
		return _Utils_update(
			position,
			{x: x});
	});
var author$project$Main$asYInPosition = F2(
	function (position, y) {
		return _Utils_update(
			position,
			{y: y});
	});
var author$project$Main$asZInPosition = F2(
	function (position, z) {
		return _Utils_update(
			position,
			{z: z});
	});
var author$project$Main$asAxisInPosition = function (axis) {
	switch (axis.$) {
		case 'X':
			return author$project$Main$asXInPosition;
		case 'Y':
			return author$project$Main$asYInPosition;
		default:
			return author$project$Main$asZInPosition;
	}
};
var author$project$Main$asHeightInSize = F2(
	function (size, height) {
		return _Utils_update(
			size,
			{height: height});
	});
var author$project$Main$asLengthInSize = F2(
	function (size, length) {
		return _Utils_update(
			size,
			{length: length});
	});
var author$project$Main$asWidthInSize = F2(
	function (size, width) {
		return _Utils_update(
			size,
			{width: width});
	});
var author$project$Main$asDimensionInSize = function (dimension) {
	switch (dimension.$) {
		case 'Length':
			return author$project$Main$asLengthInSize;
		case 'Width':
			return author$project$Main$asWidthInSize;
		default:
			return author$project$Main$asHeightInSize;
	}
};
var author$project$Main$asPositionInBlock = F2(
	function (block, position) {
		return _Utils_update(
			block,
			{position: position});
	});
var author$project$Main$asPositionInPartitionZero = F2(
	function (zero, newPosition) {
		return _Utils_update(
			zero,
			{position: newPosition});
	});
var author$project$Main$asSizeInBlock = F2(
	function (block, size) {
		return _Utils_update(
			block,
			{size: size});
	});
var author$project$Main$asSpacingExceptionsInPartition = F2(
	function (partition, newSpacingExceptions) {
		return _Utils_update(
			partition,
			{spacingExceptions: newSpacingExceptions});
	});
var author$project$Main$asZeroInPartition = F2(
	function (partition, newZero) {
		return _Utils_update(
			partition,
			{zero: newZero});
	});
var author$project$Main$axisAccessor = function (axis) {
	switch (axis.$) {
		case 'X':
			return function ($) {
				return $.x;
			};
		case 'Y':
			return function ($) {
				return $.y;
			};
		default:
			return function ($) {
				return $.z;
			};
	}
};
var author$project$Main$dimensionAccessor = function (dimension) {
	switch (dimension.$) {
		case 'Length':
			return function ($) {
				return $.length;
			};
		case 'Width':
			return function ($) {
				return $.width;
			};
		default:
			return function ($) {
				return $.height;
			};
	}
};
var author$project$Main$encodeColor = function (color) {
	var rgb = avh4$elm_color$Color$toRgba(color);
	return elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'red',
				elm$json$Json$Encode$float(rgb.red)),
				_Utils_Tuple2(
				'green',
				elm$json$Json$Encode$float(rgb.green)),
				_Utils_Tuple2(
				'blue',
				elm$json$Json$Encode$float(rgb.blue)),
				_Utils_Tuple2(
				'alpha',
				elm$json$Json$Encode$float(rgb.alpha))
			]));
};
var avh4$elm_color$Color$rgb = F3(
	function (r, g, b) {
		return A4(avh4$elm_color$Color$RgbaSpace, r, g, b, 1.0);
	});
var author$project$SIRColorPicker$indigo = A3(avh4$elm_color$Color$rgb, 63, 81, 181);
var author$project$Main$encodeAddBlockCommand = function (label) {
	return elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'label',
				elm$json$Json$Encode$string(label)),
				_Utils_Tuple2(
				'color',
				author$project$Main$encodeColor(author$project$SIRColorPicker$indigo))
			]));
};
var author$project$Main$encodePosition = function (position) {
	return elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'x',
				elm$json$Json$Encode$float(position.x.value)),
				_Utils_Tuple2(
				'y',
				elm$json$Json$Encode$float(position.y.value)),
				_Utils_Tuple2(
				'z',
				elm$json$Json$Encode$float(position.z.value))
			]));
};
var author$project$Main$encodeSize = function (size) {
	return elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'x',
				elm$json$Json$Encode$float(size.length.value)),
				_Utils_Tuple2(
				'y',
				elm$json$Json$Encode$float(size.width.value)),
				_Utils_Tuple2(
				'z',
				elm$json$Json$Encode$float(size.height.value))
			]));
};
var author$project$Main$referenceForMassToString = function (referenceForMass) {
	switch (referenceForMass.$) {
		case 'None':
			return 'None';
		case 'Mass':
			return 'Mass';
		default:
			return 'Density';
	}
};
var author$project$Main$encodeBlock = function (block) {
	return elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'uuid',
				elm$json$Json$Encode$string(block.uuid)),
				_Utils_Tuple2(
				'label',
				elm$json$Json$Encode$string(block.label)),
				_Utils_Tuple2(
				'color',
				author$project$Main$encodeColor(block.color)),
				_Utils_Tuple2(
				'position',
				author$project$Main$encodePosition(block.position)),
				_Utils_Tuple2(
				'size',
				author$project$Main$encodeSize(block.size)),
				_Utils_Tuple2(
				'referenceForMass',
				elm$json$Json$Encode$string(
					author$project$Main$referenceForMassToString(block.referenceForMass))),
				_Utils_Tuple2(
				'mass',
				elm$json$Json$Encode$float(block.mass.value)),
				_Utils_Tuple2(
				'density',
				elm$json$Json$Encode$float(block.density.value)),
				_Utils_Tuple2(
				'visible',
				elm$json$Json$Encode$bool(block.visible)),
				_Utils_Tuple2(
				'centerOfGravity',
				author$project$Main$encodePosition(block.centerOfGravity))
			]));
};
var author$project$Main$encodeChangeColorCommand = function (block) {
	return elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'uuid',
				elm$json$Json$Encode$string(block.uuid)),
				_Utils_Tuple2(
				'color',
				author$project$Main$encodeColor(block.color))
			]));
};
var author$project$Main$encodeListBlocks = function (blocks) {
	return A2(elm$json$Json$Encode$list, author$project$Main$encodeBlock, blocks);
};
var author$project$Main$encodePoint = function (point) {
	return elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'x',
				elm$json$Json$Encode$float(point.x)),
				_Utils_Tuple2(
				'y',
				elm$json$Json$Encode$float(point.y)),
				_Utils_Tuple2(
				'z',
				elm$json$Json$Encode$float(point.z))
			]));
};
var author$project$Main$encodeSTL = F2(
	function (name, hullSlices) {
		return elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'name',
					elm$json$Json$Encode$string(name)),
					_Utils_Tuple2(
					'data',
					author$project$EncodersDecoders$encoder(hullSlices))
				]));
	});
var author$project$Main$encodeToggleBlocksVisibilityCmd = F2(
	function (blocks, visible) {
		return elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'visible',
					elm$json$Json$Encode$bool(visible)),
					_Utils_Tuple2(
					'uuids',
					A2(
						elm$json$Json$Encode$list,
						A2(
							elm$core$Basics$composeL,
							elm$json$Json$Encode$string,
							function ($) {
								return $.uuid;
							}),
						blocks))
				]));
	});
var author$project$Main$encodeUpdatePositionCommand = function (block) {
	return elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'uuid',
				elm$json$Json$Encode$string(block.uuid)),
				_Utils_Tuple2(
				'position',
				author$project$Main$encodePosition(block.position))
			]));
};
var author$project$Main$encodeUpdateSizeCommand = function (block) {
	return elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'uuid',
				elm$json$Json$Encode$string(block.uuid)),
				_Utils_Tuple2(
				'size',
				author$project$Main$encodeSize(block.size))
			]));
};
var author$project$Main$flip = function (f) {
	var g = F2(
		function (y, x) {
			return A2(f, x, y);
		});
	return g;
};
var author$project$Dict$Any$get = F2(
	function (k, _n0) {
		var dict = _n0.a.dict;
		var toKey = _n0.a.toKey;
		return A2(
			elm$core$Maybe$map,
			elm$core$Tuple$second,
			A2(
				elm$core$Dict$get,
				toKey(k),
				dict));
	});
var author$project$AllDictList$get = F2(
	function (key, _n0) {
		var dict = _n0.a;
		return A2(author$project$Dict$Any$get, key, dict);
	});
var author$project$DictList$get = author$project$AllDictList$get;
var author$project$Main$getBlockByUUID = F2(
	function (uuid, blocks) {
		return A2(author$project$DictList$get, uuid, blocks);
	});
var author$project$Main$loadHullJsData = F2(
	function (model, hullReference) {
		var _n0 = A2(elm$core$Dict$get, hullReference, model.slices);
		if (_n0.$ === 'Nothing') {
			return elm$core$Maybe$Nothing;
		} else {
			var hullSlices = _n0.a;
			return elm$core$Maybe$Just(
				{
					data: A3(
						author$project$EncodersDecoders$encoderWithSelectedSlice,
						model.uiState.selectedSlice.value,
						model.uiState.showSelectedSlice,
						author$project$HullSlices$applyCustomPropertiesToHullSlices(hullSlices)),
					tag: 'load-hull'
				});
		}
	});
var author$project$StringValueInput$asStringIn = F2(
	function (numberInput, string) {
		return _Utils_update(
			numberInput,
			{string: string});
	});
var author$project$StringValueInput$asValueIn = F2(
	function (numberInput, value) {
		return _Utils_update(
			numberInput,
			{value: value});
	});
var elm$core$List$member = F2(
	function (x, xs) {
		return A2(
			elm$core$List$any,
			function (a) {
				return _Utils_eq(a, x);
			},
			xs);
	});
var elm$json$Json$Encode$null = _Json_encodeNull;
var author$project$Main$msg2json = F2(
	function (model, action) {
		switch (action.$) {
			case 'ExportSTL':
				var hullReference = action.a;
				var _n1 = A2(elm$core$Dict$get, hullReference, model.slices);
				if (_n1.$ === 'Nothing') {
					return elm$core$Maybe$Nothing;
				} else {
					var hullSlices = _n1.a;
					return elm$core$Maybe$Just(
						{
							data: A2(author$project$Main$encodeSTL, hullReference, hullSlices),
							tag: 'export-stl'
						});
				}
			case 'ExportSubModel':
				var hullReference = action.a;
				var _n2 = A2(elm$core$Dict$get, hullReference, model.slices);
				if (_n2.$ === 'Nothing') {
					return elm$core$Maybe$Nothing;
				} else {
					var hullSlices = _n2.a;
					var zAtDraught_ = (hullSlices.zmin + hullSlices.depth.value) - hullSlices.draught.value;
					var intersectBelowSlicesZY = A2(
						author$project$HullSlicesMetrics$intersectBelow,
						zAtDraught_,
						author$project$HullSlicesMetrics$fillHullSliceMetrics(hullSlices));
					return elm$core$Maybe$Just(
						{
							data: author$project$EncodersDecoders$encodeSubModel(intersectBelowSlicesZY),
							tag: 'export-submodel'
						});
				}
			case 'ExportCSV':
				var hullReference = action.a;
				var _n3 = A2(elm$core$Dict$get, hullReference, model.slices);
				if (_n3.$ === 'Nothing') {
					return elm$core$Maybe$Nothing;
				} else {
					var hullSlices = _n3.a;
					var zAtDraught_ = (hullSlices.zmin + hullSlices.depth.value) - hullSlices.draught.value;
					var computedPartitions = author$project$Main$computeDecks(model.partitions.decks);
					var ldecks = A2(
						elm$core$List$append,
						A2(
							elm$core$List$map,
							function (u) {
								return u.position;
							},
							computedPartitions),
						_List_fromArray(
							[zAtDraught_]));
					var hullSlicesAsXYList = A2(
						author$project$EncodersDecoders$exportHullSlicesAsAreaXYList,
						{ldecks: ldecks, xmax: hullSlices.xmin + hullSlices.length.value, xmin: hullSlices.xmin, zAtDraught: zAtDraught_},
						hullSlices);
					return elm$core$Maybe$Just(
						{
							data: A2(elm$json$Json$Encode$list, author$project$EncodersDecoders$hullSliceAsAreaXYListEncoder, hullSlicesAsXYList),
							tag: 'export-csv'
						});
				}
			case 'ChangeBlockColor':
				var block = action.a;
				var newColor = action.b;
				return A2(
					elm$core$Maybe$map,
					function (_n4) {
						var updatedBlock = _Utils_update(
							block,
							{color: newColor});
						return {
							data: author$project$Main$encodeChangeColorCommand(updatedBlock),
							tag: 'update-color'
						};
					},
					A2(author$project$Main$getBlockByUUID, block.uuid, model.blocks));
			case 'AddBlock':
				var label = action.a;
				return elm$core$Maybe$Just(
					{
						data: author$project$Main$encodeAddBlockCommand(label),
						tag: 'add-block'
					});
			case 'OpenSaveFile':
				return elm$core$Maybe$Just(
					{
						data: elm$json$Json$Encode$string('open-save-file'),
						tag: 'read-json-file-open'
					});
			case 'OpenHullsLibrary':
				return elm$core$Maybe$Just(
					{
						data: elm$json$Json$Encode$string('import-hull-library'),
						tag: 'read-json-file-import'
					});
			case 'ReadClipboard':
				return elm$core$Maybe$Just(
					{data: elm$json$Json$Encode$null, tag: 'read-clipboard'});
			case 'RemoveBlock':
				var block = action.a;
				return elm$core$Maybe$Just(
					{
						data: author$project$Main$encodeBlock(block),
						tag: 'remove-block'
					});
			case 'RemoveBlocks':
				var blocks = action.a;
				return elm$core$Maybe$Just(
					{
						data: author$project$Main$encodeListBlocks(blocks),
						tag: 'remove-blocks'
					});
			case 'SelectBlock':
				var block = action.a;
				return elm$core$Maybe$Just(
					(!model.multipleSelect) ? {
						data: author$project$Main$encodeBlock(block),
						tag: 'select-block'
					} : (A2(elm$core$List$member, block.uuid, model.selectedBlocks) ? {
						data: author$project$Main$encodeBlock(block),
						tag: 'remove-block-from-selection'
					} : {
						data: author$project$Main$encodeBlock(block),
						tag: 'add-block-to-selection'
					}));
			case 'SelectHullReference':
				var hullReference = action.a;
				return A2(author$project$Main$loadHullJsData, model, hullReference);
			case 'SelectSlice':
				var hullReference = action.a;
				return A2(author$project$Main$loadHullJsData, model, hullReference);
			case 'ToggleSlicesDetails':
				var isOpen = action.a;
				var hullReference = action.b;
				return A2(author$project$Main$loadHullJsData, model, hullReference);
			case 'CreateHull':
				return A2(
					elm$core$Maybe$andThen,
					function (hullSlices) {
						return elm$core$Maybe$Just(
							{
								data: A3(
									author$project$EncodersDecoders$encoderWithSelectedSlice,
									model.uiState.selectedSlice.value,
									model.uiState.showSelectedSlice,
									author$project$HullSlices$applyCustomPropertiesToHullSlices(hullSlices)),
								tag: 'load-hull'
							});
					},
					A2(
						elm$core$Maybe$andThen,
						function (hullRef) {
							return A2(elm$core$Dict$get, hullRef, model.slices);
						},
						model.selectedHullReference));
			case 'RemoveHull':
				var hullReference = action.a;
				return elm$core$Maybe$Just(
					{data: elm$json$Json$Encode$null, tag: 'unload-hull'});
			case 'ModifySlice':
				var hullReference = action.b;
				return A2(author$project$Main$loadHullJsData, model, hullReference);
			case 'ResetSlice':
				var hullReference = action.a;
				var _n5 = A2(elm$core$Dict$get, hullReference, model.slices);
				if (_n5.$ === 'Nothing') {
					return elm$core$Maybe$Nothing;
				} else {
					var hullSlices = _n5.a;
					return elm$core$Maybe$Just(
						{
							data: A3(author$project$EncodersDecoders$encoderWithSelectedSlice, model.uiState.selectedSlice.value, model.uiState.showSelectedSlice, hullSlices),
							tag: 'load-hull'
						});
				}
			case 'UnselectHullReference':
				return elm$core$Maybe$Just(
					{data: elm$json$Json$Encode$null, tag: 'unload-hull'});
			case 'SetSpacingException':
				var partitionType = action.a;
				var index = action.b;
				var input = action.c;
				var _n6 = function () {
					if (partitionType.$ === 'Deck') {
						return _Utils_Tuple3('make-decks', model.partitions.decks, author$project$Main$computeDecks);
					} else {
						return _Utils_Tuple3('make-bulkheads', model.partitions.bulkheads, author$project$Main$computeBulkheads);
					}
				}();
				var tag = _n6.a;
				var partition = _n6.b;
				var computePartition = _n6.c;
				var parsedInput = (input === '') ? elm$core$Maybe$Just(
					function ($) {
						return $.spacing;
					}(partition).value) : elm$core$String$toFloat(input);
				var previousException = A2(
					elm$core$Maybe$withDefault,
					function ($) {
						return $.spacing;
					}(partition),
					A2(
						elm$core$Dict$get,
						index,
						function ($) {
							return $.spacingExceptions;
						}(partition)));
				if (parsedInput.$ === 'Just') {
					var value = parsedInput.a;
					return elm$core$Maybe$Just(
						{
							data: author$project$Main$encodeComputedPartitions(
								computePartition(
									A2(
										author$project$Main$asSpacingExceptionsInPartition,
										partition,
										function (floatInput) {
											return A3(
												elm$core$Dict$insert,
												index,
												floatInput,
												function ($) {
													return $.spacingExceptions;
												}(partition));
										}(
											A3(
												author$project$Main$flip,
												author$project$StringValueInput$asStringIn,
												input,
												A2(
													author$project$StringValueInput$asValueIn,
													previousException,
													elm$core$Basics$abs(value))))))),
							tag: tag
						});
				} else {
					return elm$core$Maybe$Nothing;
				}
			case 'SwitchViewMode':
				var newViewMode = action.a;
				return elm$core$Maybe$Just(
					{
						data: author$project$Main$encodeViewMode(newViewMode),
						tag: 'switch-mode'
					});
			case 'TogglePartitions':
				return elm$core$Maybe$Just(
					{
						data: elm$json$Json$Encode$bool(model.partitions.showing),
						tag: 'showing-partitions'
					});
			case 'ToggleBlocksVisibility':
				var blocks = action.a;
				var isVisible = action.b;
				return elm$core$Maybe$Just(
					{
						data: A2(author$project$Main$encodeToggleBlocksVisibilityCmd, blocks, isVisible),
						tag: 'blocks-visibility'
					});
			case 'UpdatePartitionNumber':
				var partitionType = action.a;
				var input = action.b;
				var _n9 = function () {
					if (partitionType.$ === 'Deck') {
						return _Utils_Tuple3('make-decks', model.partitions.decks, author$project$Main$computeDecks);
					} else {
						return _Utils_Tuple3('make-bulkheads', model.partitions.bulkheads, author$project$Main$computeBulkheads);
					}
				}();
				var tag = _n9.a;
				var partition = _n9.b;
				var computePartition = _n9.c;
				var _n11 = elm$core$String$toInt(input);
				if (_n11.$ === 'Just') {
					var value = _n11.a;
					return elm$core$Maybe$Just(
						{
							data: author$project$Main$encodeComputedPartitions(
								computePartition(
									_Utils_update(
										partition,
										{
											number: A2(
												author$project$StringValueInput$fromInt,
												'Number of partitions',
												elm$core$Basics$abs(value))
										}))),
							tag: tag
						});
				} else {
					return elm$core$Maybe$Nothing;
				}
			case 'UpdatePartitionSpacing':
				var partitionType = action.a;
				var input = action.b;
				var _n12 = function () {
					if (partitionType.$ === 'Deck') {
						return _Utils_Tuple3('make-decks', model.partitions.decks, author$project$Main$computeDecks);
					} else {
						return _Utils_Tuple3('make-bulkheads', model.partitions.bulkheads, author$project$Main$computeBulkheads);
					}
				}();
				var tag = _n12.a;
				var partition = _n12.b;
				var computePartition = _n12.c;
				var _n14 = elm$core$String$toFloat(input);
				if (_n14.$ === 'Just') {
					var value = _n14.a;
					return elm$core$Maybe$Just(
						{
							data: author$project$Main$encodeComputedPartitions(
								computePartition(
									_Utils_update(
										partition,
										{
											spacing: A4(
												author$project$StringValueInput$fromNumber,
												'm',
												'Spacing',
												1,
												elm$core$Basics$abs(value))
										}))),
							tag: tag
						});
				} else {
					return elm$core$Maybe$Nothing;
				}
			case 'UpdatePartitionZeroPosition':
				var partitionType = action.a;
				var input = action.b;
				var _n15 = function () {
					if (partitionType.$ === 'Deck') {
						return _Utils_Tuple3('make-decks', model.partitions.decks, author$project$Main$computeDecks);
					} else {
						return _Utils_Tuple3('make-bulkheads', model.partitions.bulkheads, author$project$Main$computeBulkheads);
					}
				}();
				var tag = _n15.a;
				var partition = _n15.b;
				var computePartition = _n15.c;
				var _n17 = elm$core$String$toFloat(input);
				if (_n17.$ === 'Just') {
					var value = _n17.a;
					return elm$core$Maybe$Just(
						{
							data: author$project$Main$encodeComputedPartitions(
								computePartition(
									A2(
										author$project$Main$asZeroInPartition,
										partition,
										A2(
											author$project$Main$asPositionInPartitionZero,
											partition.zero,
											A4(author$project$StringValueInput$fromNumber, 'm', 'Position of partition zero', 0, value))))),
							tag: tag
						});
				} else {
					return elm$core$Maybe$Nothing;
				}
			case 'UpdatePosition':
				var axis = action.a;
				var block = action.b;
				var input = action.c;
				return A2(
					elm$core$Maybe$map,
					function (value) {
						var blockInModel = A2(
							elm$core$Maybe$withDefault,
							block,
							A2(author$project$Main$getBlockByUUID, block.uuid, model.blocks));
						var axisFloatInput = A2(author$project$Main$axisAccessor, axis, block.position);
						var updatedBlock = A2(
							author$project$Main$asPositionInBlock,
							blockInModel,
							A3(
								author$project$Main$asAxisInPosition,
								axis,
								blockInModel.position,
								A3(
									author$project$Main$flip,
									author$project$StringValueInput$asStringIn,
									input,
									A2(author$project$StringValueInput$asValueIn, axisFloatInput, value))));
						return {
							data: author$project$Main$encodeUpdatePositionCommand(updatedBlock),
							tag: 'update-position'
						};
					},
					elm$core$String$toFloat(input));
			case 'UpdateDimension':
				var dimension = action.a;
				var block = action.b;
				var input = action.c;
				return A2(
					elm$core$Maybe$map,
					function (value) {
						var newValue = (!value) ? 0.1 : elm$core$Basics$abs(value);
						var dimensionFloatInput = A2(author$project$Main$dimensionAccessor, dimension, block.size);
						var blockInModel = A2(
							elm$core$Maybe$withDefault,
							block,
							A2(author$project$Main$getBlockByUUID, block.uuid, model.blocks));
						var updatedBlock = A2(
							author$project$Main$asSizeInBlock,
							blockInModel,
							A3(
								author$project$Main$asDimensionInSize,
								dimension,
								blockInModel.size,
								A3(
									author$project$Main$flip,
									author$project$StringValueInput$asStringIn,
									input,
									A2(author$project$StringValueInput$asValueIn, dimensionFloatInput, newValue))));
						return {
							data: author$project$Main$encodeUpdateSizeCommand(updatedBlock),
							tag: 'update-size'
						};
					},
					elm$core$String$toFloat(input));
			default:
				var updatedCoG = model.globalCenterOfGravity;
				return elm$core$Maybe$Just(
					{
						data: author$project$Main$encodePoint(updatedCoG),
						tag: 'show-center-of-gravity'
					});
		}
	});
var elm$core$Platform$Cmd$none = elm$core$Platform$Cmd$batch(_List_Nil);
var author$project$Main$sendCmdToJs = F2(
	function (model, msg) {
		var _n0 = A2(author$project$Main$msg2json, model, msg);
		if (_n0.$ === 'Just') {
			var jsCmd = _n0.a;
			return author$project$Main$toJs(jsCmd);
		} else {
			return elm$core$Platform$Cmd$none;
		}
	});
var elm$core$Dict$map = F2(
	function (func, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			return A5(
				elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				A2(func, key, value),
				A2(elm$core$Dict$map, func, left),
				A2(elm$core$Dict$map, func, right));
		}
	});
var author$project$Dict$Any$map = F2(
	function (f, _n0) {
		var dict = _n0.a.dict;
		var toKey = _n0.a.toKey;
		return author$project$Dict$Any$AnyDict(
			{
				dict: A2(
					elm$core$Dict$map,
					F2(
						function (_n1, _n2) {
							var k = _n2.a;
							var v = _n2.b;
							return _Utils_Tuple2(
								k,
								A2(f, k, v));
						}),
					dict),
				toKey: toKey
			});
	});
var author$project$AllDictList$map = F2(
	function (func, _n0) {
		var dict = _n0.a;
		var list = _n0.b;
		return A2(
			author$project$AllDictList$AllDictList,
			A2(author$project$Dict$Any$map, func, dict),
			list);
	});
var author$project$DictList$map = author$project$AllDictList$map;
var author$project$HullSliceModifiers$resetSlicesToOriginals = function (hullSlices) {
	var originalCustomHullProperties = {breadth: elm$core$Maybe$Nothing, depth: elm$core$Maybe$Nothing, draught: elm$core$Maybe$Nothing, hullslicesPositions: elm$core$Maybe$Nothing, length: elm$core$Maybe$Nothing};
	return _Utils_update(
		hullSlices,
		{custom: originalCustomHullProperties});
};
var author$project$Main$asBulkheadsInPartitions = F2(
	function (partitions, newBulkheads) {
		return _Utils_update(
			partitions,
			{bulkheads: newBulkheads});
	});
var author$project$Main$asDecksInPartitions = F2(
	function (partitions, newDecks) {
		return _Utils_update(
			partitions,
			{decks: newDecks});
	});
var author$project$Main$asNumberInPartition = F2(
	function (partition, newNumber) {
		return _Utils_update(
			partition,
			{number: newNumber});
	});
var author$project$Main$asPartitionsInModel = F2(
	function (model, newPartitions) {
		return _Utils_update(
			model,
			{partitions: newPartitions});
	});
var author$project$Main$asSpacingInPartition = F2(
	function (partition, newSpacing) {
		return _Utils_update(
			partition,
			{spacing: newSpacing});
	});
var author$project$Main$cogToPoint = function (p) {
	return {x: p.x.value, y: p.y.value, z: p.z.value};
};
var author$project$Main$getCenterOfGravity = function (block) {
	return author$project$Main$cogToPoint(block.centerOfGravity);
};
var author$project$Main$getAbsoluteCenterOfGravity = function (block) {
	return {x: block.position.x.value + block.centerOfGravity.x.value, y: block.position.y.value + block.centerOfGravity.y.value, z: block.position.z.value - block.centerOfGravity.z.value};
};
var author$project$AllDictList$foldr = F3(
	function (func, accum, _n0) {
		var dict = _n0.a;
		var list = _n0.b;
		var go = F2(
			function (key, acc) {
				var _n1 = A2(author$project$Dict$Any$get, key, dict);
				if (_n1.$ === 'Just') {
					var value = _n1.a;
					return A3(func, key, value, acc);
				} else {
					return accum;
				}
			});
		return A3(elm$core$List$foldr, go, accum, list);
	});
var author$project$AllDictList$values = function (dictList) {
	return A3(
		author$project$AllDictList$foldr,
		F3(
			function (_n0, value, valueList) {
				return A2(elm$core$List$cons, value, valueList);
			}),
		_List_Nil,
		dictList);
};
var author$project$DictList$values = author$project$AllDictList$values;
var author$project$Main$toList = function (blocks) {
	return author$project$DictList$values(blocks);
};
var author$project$Main$toMassList = function (blocks) {
	return A2(
		elm$core$List$map,
		A2(
			elm$core$Basics$composeL,
			function ($) {
				return $.value;
			},
			function ($) {
				return $.mass;
			}),
		author$project$Main$toList(blocks));
};
var elm$core$List$sum = function (numbers) {
	return A3(elm$core$List$foldl, elm$core$Basics$add, 0, numbers);
};
var author$project$Main$getSumOfMasses = function (blocks) {
	return elm$core$List$sum(
		author$project$Main$toMassList(blocks));
};
var elm$core$Basics$neq = _Utils_notEqual;
var author$project$Main$getCentroidOfBlocks = function (blocks) {
	var weightedCenterOfGravity = function (block) {
		var cog = author$project$Main$getAbsoluteCenterOfGravity(block);
		return {x: block.mass.value * cog.x, y: block.mass.value * cog.y, z: block.mass.value * cog.z};
	};
	var sumOfMasses = author$project$Main$getSumOfMasses(blocks);
	var divideBySumOfMasses = function (point) {
		return sumOfMasses ? {x: point.x / sumOfMasses, y: point.y / sumOfMasses, z: point.z / sumOfMasses} : {x: 0, y: 0, z: 0};
	};
	var addWeightedCentersOfGravity = F2(
		function (centerA, centerB) {
			return {x: centerA.x + centerB.x, y: centerA.y + centerB.y, z: centerA.z + centerB.z};
		});
	return divideBySumOfMasses(
		A3(
			elm$core$List$foldl,
			addWeightedCentersOfGravity,
			{x: 0, y: 0, z: 0},
			A2(
				elm$core$List$map,
				weightedCenterOfGravity,
				author$project$Main$toList(blocks))));
};
var TSFoster$elm_sha1$SHA1$Digest = F5(
	function (a, b, c, d, e) {
		return {$: 'Digest', a: a, b: b, c: c, d: d, e: e};
	});
var TSFoster$elm_sha1$SHA1$finalDigest = function (_n0) {
	var h0 = _n0.h0;
	var h1 = _n0.h1;
	var h2 = _n0.h2;
	var h3 = _n0.h3;
	var h4 = _n0.h4;
	return A5(TSFoster$elm_sha1$SHA1$Digest, h0, h1, h2, h3, h4);
};
var TSFoster$elm_sha1$SHA1$State = F5(
	function (h0, h1, h2, h3, h4) {
		return {h0: h0, h1: h1, h2: h2, h3: h3, h4: h4};
	});
var TSFoster$elm_sha1$SHA1$init = A5(TSFoster$elm_sha1$SHA1$State, 1732584193, 4023233417, 2562383102, 271733878, 3285377520);
var TSFoster$elm_sha1$SHA1$DeltaState = F5(
	function (a, b, c, d, e) {
		return {a: a, b: b, c: c, d: d, e: e};
	});
var elm$core$Bitwise$and = _Bitwise_and;
var TSFoster$elm_sha1$SHA1$trim = elm$core$Bitwise$and(4294967295);
var elm$core$Bitwise$shiftLeftBy = _Bitwise_shiftLeftBy;
var elm$core$Bitwise$shiftRightZfBy = _Bitwise_shiftRightZfBy;
var TSFoster$elm_sha1$SHA1$rotateLeftBy = F2(
	function (amount, i) {
		return TSFoster$elm_sha1$SHA1$trim(
			(i >>> (32 - amount)) + TSFoster$elm_sha1$SHA1$trim(i << amount));
	});
var elm$core$Bitwise$complement = _Bitwise_complement;
var elm$core$Bitwise$or = _Bitwise_or;
var elm$core$Bitwise$xor = _Bitwise_xor;
var TSFoster$elm_sha1$SHA1$calculateDigestDeltas = F3(
	function (index, _int, _n0) {
		var a = _n0.a;
		var b = _n0.b;
		var c = _n0.c;
		var d = _n0.d;
		var e = _n0.e;
		var _n1 = (index < 20) ? _Utils_Tuple2(
			(b & c) | (TSFoster$elm_sha1$SHA1$trim(~b) & d),
			1518500249) : ((index < 40) ? _Utils_Tuple2(b ^ (c ^ d), 1859775393) : ((index < 60) ? _Utils_Tuple2(((b & c) | (b & d)) | (c & d), 2400959708) : _Utils_Tuple2(b ^ (c ^ d), 3395469782)));
		var f = _n1.a;
		var k = _n1.b;
		return {
			a: TSFoster$elm_sha1$SHA1$trim(
				TSFoster$elm_sha1$SHA1$trim(
					TSFoster$elm_sha1$SHA1$trim(
						TSFoster$elm_sha1$SHA1$trim(
							A2(TSFoster$elm_sha1$SHA1$rotateLeftBy, 5, a) + f) + e) + k) + _int),
			b: a,
			c: A2(TSFoster$elm_sha1$SHA1$rotateLeftBy, 30, b),
			d: c,
			e: d
		};
	});
var elm$core$Array$bitMask = 4294967295 >>> (32 - elm$core$Array$shiftStep);
var elm$core$Elm$JsArray$unsafeGet = _JsArray_unsafeGet;
var elm$core$Array$getHelp = F3(
	function (shift, index, tree) {
		getHelp:
		while (true) {
			var pos = elm$core$Array$bitMask & (index >>> shift);
			var _n0 = A2(elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (_n0.$ === 'SubTree') {
				var subTree = _n0.a;
				var $temp$shift = shift - elm$core$Array$shiftStep,
					$temp$index = index,
					$temp$tree = subTree;
				shift = $temp$shift;
				index = $temp$index;
				tree = $temp$tree;
				continue getHelp;
			} else {
				var values = _n0.a;
				return A2(elm$core$Elm$JsArray$unsafeGet, elm$core$Array$bitMask & index, values);
			}
		}
	});
var elm$core$Array$tailIndex = function (len) {
	return (len >>> 5) << 5;
};
var elm$core$Array$get = F2(
	function (index, _n0) {
		var len = _n0.a;
		var startShift = _n0.b;
		var tree = _n0.c;
		var tail = _n0.d;
		return ((index < 0) || (_Utils_cmp(index, len) > -1)) ? elm$core$Maybe$Nothing : ((_Utils_cmp(
			index,
			elm$core$Array$tailIndex(len)) > -1) ? elm$core$Maybe$Just(
			A2(elm$core$Elm$JsArray$unsafeGet, elm$core$Array$bitMask & index, tail)) : elm$core$Maybe$Just(
			A3(elm$core$Array$getHelp, startShift, index, tree)));
	});
var elm$core$Elm$JsArray$push = _JsArray_push;
var elm$core$Elm$JsArray$singleton = _JsArray_singleton;
var elm$core$Elm$JsArray$unsafeSet = _JsArray_unsafeSet;
var elm$core$Array$insertTailInTree = F4(
	function (shift, index, tail, tree) {
		var pos = elm$core$Array$bitMask & (index >>> shift);
		if (_Utils_cmp(
			pos,
			elm$core$Elm$JsArray$length(tree)) > -1) {
			if (shift === 5) {
				return A2(
					elm$core$Elm$JsArray$push,
					elm$core$Array$Leaf(tail),
					tree);
			} else {
				var newSub = elm$core$Array$SubTree(
					A4(elm$core$Array$insertTailInTree, shift - elm$core$Array$shiftStep, index, tail, elm$core$Elm$JsArray$empty));
				return A2(elm$core$Elm$JsArray$push, newSub, tree);
			}
		} else {
			var value = A2(elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (value.$ === 'SubTree') {
				var subTree = value.a;
				var newSub = elm$core$Array$SubTree(
					A4(elm$core$Array$insertTailInTree, shift - elm$core$Array$shiftStep, index, tail, subTree));
				return A3(elm$core$Elm$JsArray$unsafeSet, pos, newSub, tree);
			} else {
				var newSub = elm$core$Array$SubTree(
					A4(
						elm$core$Array$insertTailInTree,
						shift - elm$core$Array$shiftStep,
						index,
						tail,
						elm$core$Elm$JsArray$singleton(value)));
				return A3(elm$core$Elm$JsArray$unsafeSet, pos, newSub, tree);
			}
		}
	});
var elm$core$Array$unsafeReplaceTail = F2(
	function (newTail, _n0) {
		var len = _n0.a;
		var startShift = _n0.b;
		var tree = _n0.c;
		var tail = _n0.d;
		var originalTailLen = elm$core$Elm$JsArray$length(tail);
		var newTailLen = elm$core$Elm$JsArray$length(newTail);
		var newArrayLen = len + (newTailLen - originalTailLen);
		if (_Utils_eq(newTailLen, elm$core$Array$branchFactor)) {
			var overflow = _Utils_cmp(newArrayLen >>> elm$core$Array$shiftStep, 1 << startShift) > 0;
			if (overflow) {
				var newShift = startShift + elm$core$Array$shiftStep;
				var newTree = A4(
					elm$core$Array$insertTailInTree,
					newShift,
					len,
					newTail,
					elm$core$Elm$JsArray$singleton(
						elm$core$Array$SubTree(tree)));
				return A4(elm$core$Array$Array_elm_builtin, newArrayLen, newShift, newTree, elm$core$Elm$JsArray$empty);
			} else {
				return A4(
					elm$core$Array$Array_elm_builtin,
					newArrayLen,
					startShift,
					A4(elm$core$Array$insertTailInTree, startShift, len, newTail, tree),
					elm$core$Elm$JsArray$empty);
			}
		} else {
			return A4(elm$core$Array$Array_elm_builtin, newArrayLen, startShift, tree, newTail);
		}
	});
var elm$core$Array$push = F2(
	function (a, array) {
		var tail = array.d;
		return A2(
			elm$core$Array$unsafeReplaceTail,
			A2(elm$core$Elm$JsArray$push, a, tail),
			array);
	});
var TSFoster$elm_sha1$SHA1$reduceWords = F2(
	function (index, words) {
		var v = function (i) {
			return A2(elm$core$Array$get, index - i, words);
		};
		var val = A2(
			TSFoster$elm_sha1$SHA1$rotateLeftBy,
			1,
			A3(
				elm$core$List$foldl,
				elm$core$Bitwise$xor,
				0,
				A2(
					elm$core$List$filterMap,
					elm$core$Basics$identity,
					_List_fromArray(
						[
							v(3),
							v(8),
							v(14),
							v(16)
						]))));
		return A2(elm$core$Array$push, val, words);
	});
var TSFoster$elm_sha1$SHA1$wordFromInts = function (ints) {
	if ((((ints.b && ints.b.b) && ints.b.b.b) && ints.b.b.b.b) && (!ints.b.b.b.b.b)) {
		var a = ints.a;
		var _n1 = ints.b;
		var b = _n1.a;
		var _n2 = _n1.b;
		var c = _n2.a;
		var _n3 = _n2.b;
		var d = _n3.a;
		return A3(
			elm$core$List$foldl,
			elm$core$Bitwise$or,
			d,
			_List_fromArray(
				[c << 8, b << 16, a << 24]));
	} else {
		return 0;
	}
};
var elm$core$List$takeReverse = F3(
	function (n, list, kept) {
		takeReverse:
		while (true) {
			if (n <= 0) {
				return kept;
			} else {
				if (!list.b) {
					return kept;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs,
						$temp$kept = A2(elm$core$List$cons, x, kept);
					n = $temp$n;
					list = $temp$list;
					kept = $temp$kept;
					continue takeReverse;
				}
			}
		}
	});
var elm$core$List$takeTailRec = F2(
	function (n, list) {
		return elm$core$List$reverse(
			A3(elm$core$List$takeReverse, n, list, _List_Nil));
	});
var elm$core$List$takeFast = F3(
	function (ctr, n, list) {
		if (n <= 0) {
			return _List_Nil;
		} else {
			var _n0 = _Utils_Tuple2(n, list);
			_n0$1:
			while (true) {
				_n0$5:
				while (true) {
					if (!_n0.b.b) {
						return list;
					} else {
						if (_n0.b.b.b) {
							switch (_n0.a) {
								case 1:
									break _n0$1;
								case 2:
									var _n2 = _n0.b;
									var x = _n2.a;
									var _n3 = _n2.b;
									var y = _n3.a;
									return _List_fromArray(
										[x, y]);
								case 3:
									if (_n0.b.b.b.b) {
										var _n4 = _n0.b;
										var x = _n4.a;
										var _n5 = _n4.b;
										var y = _n5.a;
										var _n6 = _n5.b;
										var z = _n6.a;
										return _List_fromArray(
											[x, y, z]);
									} else {
										break _n0$5;
									}
								default:
									if (_n0.b.b.b.b && _n0.b.b.b.b.b) {
										var _n7 = _n0.b;
										var x = _n7.a;
										var _n8 = _n7.b;
										var y = _n8.a;
										var _n9 = _n8.b;
										var z = _n9.a;
										var _n10 = _n9.b;
										var w = _n10.a;
										var tl = _n10.b;
										return (ctr > 1000) ? A2(
											elm$core$List$cons,
											x,
											A2(
												elm$core$List$cons,
												y,
												A2(
													elm$core$List$cons,
													z,
													A2(
														elm$core$List$cons,
														w,
														A2(elm$core$List$takeTailRec, n - 4, tl))))) : A2(
											elm$core$List$cons,
											x,
											A2(
												elm$core$List$cons,
												y,
												A2(
													elm$core$List$cons,
													z,
													A2(
														elm$core$List$cons,
														w,
														A3(elm$core$List$takeFast, ctr + 1, n - 4, tl)))));
									} else {
										break _n0$5;
									}
							}
						} else {
							if (_n0.a === 1) {
								break _n0$1;
							} else {
								break _n0$5;
							}
						}
					}
				}
				return list;
			}
			var _n1 = _n0.b;
			var x = _n1.a;
			return _List_fromArray(
				[x]);
		}
	});
var elm$core$List$take = F2(
	function (n, list) {
		return A3(elm$core$List$takeFast, 0, n, list);
	});
var elm_community$list_extra$List$Extra$groupsOfWithStep = F3(
	function (size, step, xs) {
		var xs_ = A2(elm$core$List$drop, step, xs);
		var thisGroup = A2(elm$core$List$take, size, xs);
		var okayLength = _Utils_eq(
			size,
			elm$core$List$length(thisGroup));
		var okayArgs = (size > 0) && (step > 0);
		return (okayArgs && okayLength) ? A2(
			elm$core$List$cons,
			thisGroup,
			A3(elm_community$list_extra$List$Extra$groupsOfWithStep, size, step, xs_)) : _List_Nil;
	});
var elm_community$list_extra$List$Extra$groupsOf = F2(
	function (size, xs) {
		return A3(elm_community$list_extra$List$Extra$groupsOfWithStep, size, size, xs);
	});
var elm_community$list_extra$List$Extra$indexedFoldl = F3(
	function (func, acc, list) {
		var step = F2(
			function (x, _n0) {
				var i = _n0.a;
				var thisAcc = _n0.b;
				return _Utils_Tuple2(
					i + 1,
					A3(func, i, x, thisAcc));
			});
		return A3(
			elm$core$List$foldl,
			step,
			_Utils_Tuple2(0, acc),
			list).b;
	});
var elm_community$list_extra$List$Extra$initialize = F2(
	function (n, f) {
		var step = F2(
			function (i, acc) {
				step:
				while (true) {
					if (i < 0) {
						return acc;
					} else {
						var $temp$i = i - 1,
							$temp$acc = A2(
							elm$core$List$cons,
							f(i),
							acc);
						i = $temp$i;
						acc = $temp$acc;
						continue step;
					}
				}
			});
		return A2(step, n - 1, _List_Nil);
	});
var TSFoster$elm_sha1$SHA1$reduceMessage = F2(
	function (chunk, _n0) {
		var h0 = _n0.h0;
		var h1 = _n0.h1;
		var h2 = _n0.h2;
		var h3 = _n0.h3;
		var h4 = _n0.h4;
		var words = elm$core$Array$fromList(
			A2(
				elm$core$List$map,
				TSFoster$elm_sha1$SHA1$wordFromInts,
				A2(elm_community$list_extra$List$Extra$groupsOf, 4, chunk)));
		var initialDeltas = A5(TSFoster$elm_sha1$SHA1$DeltaState, h0, h1, h2, h3, h4);
		var _n1 = A3(
			elm_community$list_extra$List$Extra$indexedFoldl,
			TSFoster$elm_sha1$SHA1$calculateDigestDeltas,
			initialDeltas,
			elm$core$Array$toList(
				A3(
					elm$core$List$foldl,
					TSFoster$elm_sha1$SHA1$reduceWords,
					words,
					A2(
						elm_community$list_extra$List$Extra$initialize,
						64,
						elm$core$Basics$add(16)))));
		var a = _n1.a;
		var b = _n1.b;
		var c = _n1.c;
		var d = _n1.d;
		var e = _n1.e;
		return A5(
			TSFoster$elm_sha1$SHA1$State,
			TSFoster$elm_sha1$SHA1$trim(h0 + a),
			TSFoster$elm_sha1$SHA1$trim(h1 + b),
			TSFoster$elm_sha1$SHA1$trim(h2 + c),
			TSFoster$elm_sha1$SHA1$trim(h3 + d),
			TSFoster$elm_sha1$SHA1$trim(h4 + e));
	});
var elm$core$Basics$modBy = _Basics_modBy;
var TSFoster$elm_sha1$SHA1$hashBytes = function (bytes) {
	var byteCount = elm$core$List$length(bytes);
	var zeroBytesToAppend = 4 + A2(
		elm$core$Basics$modBy,
		64,
		56 - A2(elm$core$Basics$modBy, 64, byteCount + 1));
	var bitCountInBytes = _List_fromArray(
		[255 & (byteCount >>> (24 - 3)), 255 & (byteCount >>> (16 - 3)), 255 & (byteCount >>> (8 - 3)), 255 & (byteCount << 3)]);
	var bytesToAppend = A2(
		elm$core$List$cons,
		128,
		_Utils_ap(
			A2(elm$core$List$repeat, zeroBytesToAppend, 0),
			bitCountInBytes));
	var message = _Utils_ap(bytes, bytesToAppend);
	var chunks = A2(elm_community$list_extra$List$Extra$groupsOf, 64, message);
	var hashState = A3(elm$core$List$foldl, TSFoster$elm_sha1$SHA1$reduceMessage, TSFoster$elm_sha1$SHA1$init, chunks);
	return TSFoster$elm_sha1$SHA1$finalDigest(hashState);
};
var elm$core$String$foldl = _String_foldl;
var zwilias$elm_utf_tools$String$UTF8$utf32ToUtf8 = F3(
	function (add, _char, acc) {
		return (_char < 128) ? A2(add, _char, acc) : ((_char < 2048) ? A2(
			add,
			128 | (63 & _char),
			A2(add, 192 | (_char >>> 6), acc)) : ((_char < 65536) ? A2(
			add,
			128 | (63 & _char),
			A2(
				add,
				128 | (63 & (_char >>> 6)),
				A2(add, 224 | (_char >>> 12), acc))) : A2(
			add,
			128 | (63 & _char),
			A2(
				add,
				128 | (63 & (_char >>> 6)),
				A2(
					add,
					128 | (63 & (_char >>> 12)),
					A2(add, 240 | (_char >>> 18), acc))))));
	});
var zwilias$elm_utf_tools$String$UTF8$foldl = F3(
	function (op, initialAcc, input) {
		return A3(
			elm$core$String$foldl,
			F2(
				function (_char, acc) {
					return A3(
						zwilias$elm_utf_tools$String$UTF8$utf32ToUtf8,
						op,
						elm$core$Char$toCode(_char),
						acc);
				}),
			initialAcc,
			input);
	});
var zwilias$elm_utf_tools$String$UTF8$toBytes = function (input) {
	return elm$core$List$reverse(
		A3(zwilias$elm_utf_tools$String$UTF8$foldl, elm$core$List$cons, _List_Nil, input));
};
var TSFoster$elm_sha1$SHA1$fromString = A2(elm$core$Basics$composeR, zwilias$elm_utf_tools$String$UTF8$toBytes, TSFoster$elm_sha1$SHA1$hashBytes);
var elm$core$String$concat = function (strings) {
	return A2(elm$core$String$join, '', strings);
};
var elm$core$String$cons = _String_cons;
var elm$core$String$fromChar = function (_char) {
	return A2(elm$core$String$cons, _char, '');
};
var elm$core$Bitwise$shiftRightBy = _Bitwise_shiftRightBy;
var elm$core$String$repeatHelp = F3(
	function (n, chunk, result) {
		return (n <= 0) ? result : A3(
			elm$core$String$repeatHelp,
			n >> 1,
			_Utils_ap(chunk, chunk),
			(!(n & 1)) ? result : _Utils_ap(result, chunk));
	});
var elm$core$String$repeat = F2(
	function (n, chunk) {
		return A3(elm$core$String$repeatHelp, n, chunk, '');
	});
var elm$core$String$padLeft = F3(
	function (n, _char, string) {
		return _Utils_ap(
			A2(
				elm$core$String$repeat,
				n - elm$core$String$length(string),
				elm$core$String$fromChar(_char)),
			string);
	});
var elm$core$String$fromList = _String_fromList;
var rtfeldman$elm_hex$Hex$unsafeToDigit = function (num) {
	unsafeToDigit:
	while (true) {
		switch (num) {
			case 0:
				return _Utils_chr('0');
			case 1:
				return _Utils_chr('1');
			case 2:
				return _Utils_chr('2');
			case 3:
				return _Utils_chr('3');
			case 4:
				return _Utils_chr('4');
			case 5:
				return _Utils_chr('5');
			case 6:
				return _Utils_chr('6');
			case 7:
				return _Utils_chr('7');
			case 8:
				return _Utils_chr('8');
			case 9:
				return _Utils_chr('9');
			case 10:
				return _Utils_chr('a');
			case 11:
				return _Utils_chr('b');
			case 12:
				return _Utils_chr('c');
			case 13:
				return _Utils_chr('d');
			case 14:
				return _Utils_chr('e');
			case 15:
				return _Utils_chr('f');
			default:
				var $temp$num = num;
				num = $temp$num;
				continue unsafeToDigit;
		}
	}
};
var rtfeldman$elm_hex$Hex$unsafePositiveToDigits = F2(
	function (digits, num) {
		unsafePositiveToDigits:
		while (true) {
			if (num < 16) {
				return A2(
					elm$core$List$cons,
					rtfeldman$elm_hex$Hex$unsafeToDigit(num),
					digits);
			} else {
				var $temp$digits = A2(
					elm$core$List$cons,
					rtfeldman$elm_hex$Hex$unsafeToDigit(
						A2(elm$core$Basics$modBy, 16, num)),
					digits),
					$temp$num = (num / 16) | 0;
				digits = $temp$digits;
				num = $temp$num;
				continue unsafePositiveToDigits;
			}
		}
	});
var rtfeldman$elm_hex$Hex$toString = function (num) {
	return elm$core$String$fromList(
		(num < 0) ? A2(
			elm$core$List$cons,
			_Utils_chr('-'),
			A2(rtfeldman$elm_hex$Hex$unsafePositiveToDigits, _List_Nil, -num)) : A2(rtfeldman$elm_hex$Hex$unsafePositiveToDigits, _List_Nil, num));
};
var TSFoster$elm_sha1$SHA1$wordToHex = function (_int) {
	var right = 65535 & _int;
	var left = _int >>> 16;
	return elm$core$String$concat(
		A2(
			elm$core$List$map,
			A2(
				elm$core$Basics$composeR,
				rtfeldman$elm_hex$Hex$toString,
				A2(
					elm$core$String$padLeft,
					4,
					_Utils_chr('0'))),
			_List_fromArray(
				[left, right])));
};
var TSFoster$elm_sha1$SHA1$toHex = function (_n0) {
	var a = _n0.a;
	var b = _n0.b;
	var c = _n0.c;
	var d = _n0.d;
	var e = _n0.e;
	return elm$core$String$concat(
		A2(
			elm$core$List$map,
			TSFoster$elm_sha1$SHA1$wordToHex,
			_List_fromArray(
				[a, b, c, d, e])));
};
var author$project$EncodersDecoders$getHashImageForSlices = function (hullSlice) {
	var hullSliceToString = A2(
		elm$json$Json$Encode$encode,
		0,
		author$project$EncodersDecoders$encoder(
			author$project$HullSliceModifiers$resetSlicesToOriginals(hullSlice)));
	return TSFoster$elm_sha1$SHA1$toHex(
		TSFoster$elm_sha1$SHA1$fromString(hullSliceToString));
};
var elm$core$Dict$values = function (dict) {
	return A3(
		elm$core$Dict$foldr,
		F3(
			function (key, value, valueList) {
				return A2(elm$core$List$cons, value, valueList);
			}),
		_List_Nil,
		dict);
};
var author$project$Main$insertIfUnique = F3(
	function (key, value, dict) {
		var valueSHA = author$project$EncodersDecoders$getHashImageForSlices(value);
		var listSHAInDict = A2(
			elm$core$List$map,
			author$project$EncodersDecoders$getHashImageForSlices,
			elm$core$Dict$values(dict));
		return A2(elm$core$List$member, valueSHA, listSHAInDict) ? elm$core$Basics$identity : A2(elm$core$Dict$insert, key, value);
	});
var author$project$Dict$Any$getOrd = function (d) {
	var dd = d.a;
	return dd.toKey;
};
var elm$core$Dict$member = F2(
	function (key, dict) {
		var _n0 = A2(elm$core$Dict$get, key, dict);
		if (_n0.$ === 'Just') {
			return true;
		} else {
			return false;
		}
	});
var author$project$Dict$Any$member = F2(
	function (k, _n0) {
		var dict = _n0.a.dict;
		var toKey = _n0.a.toKey;
		return A2(
			elm$core$Dict$member,
			toKey(k),
			dict);
	});
var author$project$AllDictList$removeKey = F3(
	function (key, dict, list) {
		var ord = author$project$Dict$Any$getOrd(dict);
		var keyComparable = ord(key);
		return A2(author$project$Dict$Any$member, key, dict) ? A2(
			elm$core$List$filter,
			function (k) {
				return !_Utils_eq(
					ord(k),
					keyComparable);
			},
			list) : list;
	});
var elm$core$Dict$getMin = function (dict) {
	getMin:
	while (true) {
		if ((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) {
			var left = dict.d;
			var $temp$dict = left;
			dict = $temp$dict;
			continue getMin;
		} else {
			return dict;
		}
	}
};
var elm$core$Dict$moveRedLeft = function (dict) {
	if (((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) && (dict.e.$ === 'RBNode_elm_builtin')) {
		if ((dict.e.d.$ === 'RBNode_elm_builtin') && (dict.e.d.a.$ === 'Red')) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _n1 = dict.d;
			var lClr = _n1.a;
			var lK = _n1.b;
			var lV = _n1.c;
			var lLeft = _n1.d;
			var lRight = _n1.e;
			var _n2 = dict.e;
			var rClr = _n2.a;
			var rK = _n2.b;
			var rV = _n2.c;
			var rLeft = _n2.d;
			var _n3 = rLeft.a;
			var rlK = rLeft.b;
			var rlV = rLeft.c;
			var rlL = rLeft.d;
			var rlR = rLeft.e;
			var rRight = _n2.e;
			return A5(
				elm$core$Dict$RBNode_elm_builtin,
				elm$core$Dict$Red,
				rlK,
				rlV,
				A5(
					elm$core$Dict$RBNode_elm_builtin,
					elm$core$Dict$Black,
					k,
					v,
					A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Red, lK, lV, lLeft, lRight),
					rlL),
				A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Black, rK, rV, rlR, rRight));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _n4 = dict.d;
			var lClr = _n4.a;
			var lK = _n4.b;
			var lV = _n4.c;
			var lLeft = _n4.d;
			var lRight = _n4.e;
			var _n5 = dict.e;
			var rClr = _n5.a;
			var rK = _n5.b;
			var rV = _n5.c;
			var rLeft = _n5.d;
			var rRight = _n5.e;
			if (clr.$ === 'Black') {
				return A5(
					elm$core$Dict$RBNode_elm_builtin,
					elm$core$Dict$Black,
					k,
					v,
					A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Red, rK, rV, rLeft, rRight));
			} else {
				return A5(
					elm$core$Dict$RBNode_elm_builtin,
					elm$core$Dict$Black,
					k,
					v,
					A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Red, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var elm$core$Dict$moveRedRight = function (dict) {
	if (((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) && (dict.e.$ === 'RBNode_elm_builtin')) {
		if ((dict.d.d.$ === 'RBNode_elm_builtin') && (dict.d.d.a.$ === 'Red')) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _n1 = dict.d;
			var lClr = _n1.a;
			var lK = _n1.b;
			var lV = _n1.c;
			var _n2 = _n1.d;
			var _n3 = _n2.a;
			var llK = _n2.b;
			var llV = _n2.c;
			var llLeft = _n2.d;
			var llRight = _n2.e;
			var lRight = _n1.e;
			var _n4 = dict.e;
			var rClr = _n4.a;
			var rK = _n4.b;
			var rV = _n4.c;
			var rLeft = _n4.d;
			var rRight = _n4.e;
			return A5(
				elm$core$Dict$RBNode_elm_builtin,
				elm$core$Dict$Red,
				lK,
				lV,
				A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Black, llK, llV, llLeft, llRight),
				A5(
					elm$core$Dict$RBNode_elm_builtin,
					elm$core$Dict$Black,
					k,
					v,
					lRight,
					A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Red, rK, rV, rLeft, rRight)));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _n5 = dict.d;
			var lClr = _n5.a;
			var lK = _n5.b;
			var lV = _n5.c;
			var lLeft = _n5.d;
			var lRight = _n5.e;
			var _n6 = dict.e;
			var rClr = _n6.a;
			var rK = _n6.b;
			var rV = _n6.c;
			var rLeft = _n6.d;
			var rRight = _n6.e;
			if (clr.$ === 'Black') {
				return A5(
					elm$core$Dict$RBNode_elm_builtin,
					elm$core$Dict$Black,
					k,
					v,
					A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Red, rK, rV, rLeft, rRight));
			} else {
				return A5(
					elm$core$Dict$RBNode_elm_builtin,
					elm$core$Dict$Black,
					k,
					v,
					A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Red, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var elm$core$Dict$removeHelpPrepEQGT = F7(
	function (targetKey, dict, color, key, value, left, right) {
		if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) {
			var _n1 = left.a;
			var lK = left.b;
			var lV = left.c;
			var lLeft = left.d;
			var lRight = left.e;
			return A5(
				elm$core$Dict$RBNode_elm_builtin,
				color,
				lK,
				lV,
				lLeft,
				A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Red, key, value, lRight, right));
		} else {
			_n2$2:
			while (true) {
				if ((right.$ === 'RBNode_elm_builtin') && (right.a.$ === 'Black')) {
					if (right.d.$ === 'RBNode_elm_builtin') {
						if (right.d.a.$ === 'Black') {
							var _n3 = right.a;
							var _n4 = right.d;
							var _n5 = _n4.a;
							return elm$core$Dict$moveRedRight(dict);
						} else {
							break _n2$2;
						}
					} else {
						var _n6 = right.a;
						var _n7 = right.d;
						return elm$core$Dict$moveRedRight(dict);
					}
				} else {
					break _n2$2;
				}
			}
			return dict;
		}
	});
var elm$core$Dict$removeMin = function (dict) {
	if ((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) {
		var color = dict.a;
		var key = dict.b;
		var value = dict.c;
		var left = dict.d;
		var lColor = left.a;
		var lLeft = left.d;
		var right = dict.e;
		if (lColor.$ === 'Black') {
			if ((lLeft.$ === 'RBNode_elm_builtin') && (lLeft.a.$ === 'Red')) {
				var _n3 = lLeft.a;
				return A5(
					elm$core$Dict$RBNode_elm_builtin,
					color,
					key,
					value,
					elm$core$Dict$removeMin(left),
					right);
			} else {
				var _n4 = elm$core$Dict$moveRedLeft(dict);
				if (_n4.$ === 'RBNode_elm_builtin') {
					var nColor = _n4.a;
					var nKey = _n4.b;
					var nValue = _n4.c;
					var nLeft = _n4.d;
					var nRight = _n4.e;
					return A5(
						elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						elm$core$Dict$removeMin(nLeft),
						nRight);
				} else {
					return elm$core$Dict$RBEmpty_elm_builtin;
				}
			}
		} else {
			return A5(
				elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				value,
				elm$core$Dict$removeMin(left),
				right);
		}
	} else {
		return elm$core$Dict$RBEmpty_elm_builtin;
	}
};
var elm$core$Dict$removeHelp = F2(
	function (targetKey, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_cmp(targetKey, key) < 0) {
				if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Black')) {
					var _n4 = left.a;
					var lLeft = left.d;
					if ((lLeft.$ === 'RBNode_elm_builtin') && (lLeft.a.$ === 'Red')) {
						var _n6 = lLeft.a;
						return A5(
							elm$core$Dict$RBNode_elm_builtin,
							color,
							key,
							value,
							A2(elm$core$Dict$removeHelp, targetKey, left),
							right);
					} else {
						var _n7 = elm$core$Dict$moveRedLeft(dict);
						if (_n7.$ === 'RBNode_elm_builtin') {
							var nColor = _n7.a;
							var nKey = _n7.b;
							var nValue = _n7.c;
							var nLeft = _n7.d;
							var nRight = _n7.e;
							return A5(
								elm$core$Dict$balance,
								nColor,
								nKey,
								nValue,
								A2(elm$core$Dict$removeHelp, targetKey, nLeft),
								nRight);
						} else {
							return elm$core$Dict$RBEmpty_elm_builtin;
						}
					}
				} else {
					return A5(
						elm$core$Dict$RBNode_elm_builtin,
						color,
						key,
						value,
						A2(elm$core$Dict$removeHelp, targetKey, left),
						right);
				}
			} else {
				return A2(
					elm$core$Dict$removeHelpEQGT,
					targetKey,
					A7(elm$core$Dict$removeHelpPrepEQGT, targetKey, dict, color, key, value, left, right));
			}
		}
	});
var elm$core$Dict$removeHelpEQGT = F2(
	function (targetKey, dict) {
		if (dict.$ === 'RBNode_elm_builtin') {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_eq(targetKey, key)) {
				var _n1 = elm$core$Dict$getMin(right);
				if (_n1.$ === 'RBNode_elm_builtin') {
					var minKey = _n1.b;
					var minValue = _n1.c;
					return A5(
						elm$core$Dict$balance,
						color,
						minKey,
						minValue,
						left,
						elm$core$Dict$removeMin(right));
				} else {
					return elm$core$Dict$RBEmpty_elm_builtin;
				}
			} else {
				return A5(
					elm$core$Dict$balance,
					color,
					key,
					value,
					left,
					A2(elm$core$Dict$removeHelp, targetKey, right));
			}
		} else {
			return elm$core$Dict$RBEmpty_elm_builtin;
		}
	});
var elm$core$Dict$remove = F2(
	function (key, dict) {
		var _n0 = A2(elm$core$Dict$removeHelp, key, dict);
		if ((_n0.$ === 'RBNode_elm_builtin') && (_n0.a.$ === 'Red')) {
			var _n1 = _n0.a;
			var k = _n0.b;
			var v = _n0.c;
			var l = _n0.d;
			var r = _n0.e;
			return A5(elm$core$Dict$RBNode_elm_builtin, elm$core$Dict$Black, k, v, l, r);
		} else {
			var x = _n0;
			return x;
		}
	});
var author$project$Dict$Any$remove = F2(
	function (k, _n0) {
		var inner = _n0.a;
		return author$project$Dict$Any$AnyDict(
			_Utils_update(
				inner,
				{
					dict: A2(
						elm$core$Dict$remove,
						inner.toKey(k),
						inner.dict)
				}));
	});
var author$project$AllDictList$remove = F2(
	function (key, _n0) {
		var dict = _n0.a;
		var list = _n0.b;
		return A2(
			author$project$AllDictList$AllDictList,
			A2(author$project$Dict$Any$remove, key, dict),
			A3(author$project$AllDictList$removeKey, key, dict, list));
	});
var author$project$DictList$remove = author$project$AllDictList$remove;
var author$project$Main$removeBlockFrom = F2(
	function (blocks, block) {
		return A2(author$project$DictList$remove, block.uuid, blocks);
	});
var author$project$Main$removeListBlocksFrom = F2(
	function (blocks, list) {
		removeListBlocksFrom:
		while (true) {
			if (!list.b) {
				return blocks;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$blocks = A2(author$project$Main$removeBlockFrom, blocks, x),
					$temp$list = xs;
				blocks = $temp$blocks;
				list = $temp$list;
				continue removeListBlocksFrom;
			}
		}
	});
var author$project$AllDictList$member = F2(
	function (key, _n0) {
		var dict = _n0.a;
		return A2(author$project$Dict$Any$member, key, dict);
	});
var author$project$DictList$member = author$project$AllDictList$member;
var author$project$Dict$Any$insert = F3(
	function (k, v, _n0) {
		var inner = _n0.a;
		return author$project$Dict$Any$AnyDict(
			_Utils_update(
				inner,
				{
					dict: A3(
						elm$core$Dict$insert,
						inner.toKey(k),
						_Utils_Tuple2(k, v),
						inner.dict)
				}));
	});
var author$project$AllDictList$insert = F3(
	function (key, value, _n0) {
		var dict = _n0.a;
		var list = _n0.b;
		var newList = A2(author$project$Dict$Any$member, key, dict) ? list : _Utils_ap(
			list,
			_List_fromArray(
				[key]));
		var newDict = A3(author$project$Dict$Any$insert, key, value, dict);
		return A2(author$project$AllDictList$AllDictList, newDict, newList);
	});
var author$project$DictList$insert = author$project$AllDictList$insert;
var author$project$Main$addBlockTo = F2(
	function (blocks, block) {
		return A3(author$project$DictList$insert, block.uuid, block, blocks);
	});
var author$project$Main$updateBlockInBlocks = F2(
	function (block, blocks) {
		return A2(author$project$DictList$member, block.uuid, blocks) ? A2(author$project$Main$addBlockTo, blocks, block) : blocks;
	});
var author$project$Main$updateBlockInModel = F2(
	function (block, model) {
		return _Utils_update(
			model,
			{
				blocks: A2(author$project$Main$updateBlockInBlocks, block, model.blocks)
			});
	});
var author$project$Main$computeVolume = function (block) {
	var size = block.size;
	return (size.height.value * size.width.value) * size.length.value;
};
var author$project$Main$updateBlockMassAndDensity = function (block) {
	var _n0 = block.referenceForMass;
	switch (_n0.$) {
		case 'None':
			return block;
		case 'Mass':
			return _Utils_update(
				block,
				{
					density: A4(
						author$project$StringValueInput$fromNumber,
						'kg',
						'Mass',
						1,
						block.mass.value / author$project$Main$computeVolume(block))
				});
		default:
			return _Utils_update(
				block,
				{
					mass: A4(
						author$project$StringValueInput$fromNumber,
						'kg/m^3',
						'Density',
						1,
						block.density.value * author$project$Main$computeVolume(block))
				});
	}
};
var author$project$StringValueInput$asIntIn = F2(
	function (input, value) {
		return _Utils_update(
			input,
			{
				string: elm$core$String$fromInt(value),
				value: value
			});
	});
var author$project$StringValueInput$setString = F2(
	function (s, floatInput_) {
		var _n0 = elm$core$String$toFloat(s);
		if (_n0.$ === 'Just') {
			var value = _n0.a;
			var roundedValue = A2(author$project$StringValueInput$round_n, floatInput_.nbOfDigits, value);
			return _Utils_eq(value, roundedValue) ? _Utils_update(
				floatInput_,
				{string: s, value: roundedValue}) : _Utils_update(
				floatInput_,
				{
					string: elm$core$String$fromFloat(roundedValue),
					value: roundedValue
				});
		} else {
			return _Utils_update(
				floatInput_,
				{string: s});
		}
	});
var elm$core$Dict$update = F3(
	function (targetKey, alter, dictionary) {
		var _n0 = alter(
			A2(elm$core$Dict$get, targetKey, dictionary));
		if (_n0.$ === 'Just') {
			var value = _n0.a;
			return A3(elm$core$Dict$insert, targetKey, value, dictionary);
		} else {
			return A2(elm$core$Dict$remove, targetKey, dictionary);
		}
	});
var author$project$Main$updateModelToJs = F2(
	function (msg, model) {
		switch (msg.$) {
			case 'ExportCSV':
				return model;
			case 'ExportSTL':
				return model;
			case 'ExportSubModel':
				return model;
			case 'OpenSaveFile':
				return model;
			case 'OpenHullsLibrary':
				return model;
			case 'ReadClipboard':
				var olduiState = model.uiState;
				var updateUiState = function (isWaiting) {
					return _Utils_update(
						olduiState,
						{waitToPasteClipBoard: isWaiting});
				};
				return _Utils_update(
					model,
					{
						uiState: updateUiState(true)
					});
			case 'ChangeBlockColor':
				var block = msg.a;
				var newColor = msg.b;
				var _n1 = A2(author$project$Main$getBlockByUUID, block.uuid, model.blocks);
				if (_n1.$ === 'Just') {
					var updatedBlock = _Utils_update(
						block,
						{color: newColor});
					return A2(author$project$Main$updateBlockInModel, updatedBlock, model);
				} else {
					return model;
				}
			case 'AddBlock':
				return model;
			case 'RemoveBlock':
				var block = msg.a;
				var blocks = A2(author$project$Main$removeBlockFrom, model.blocks, block);
				return _Utils_update(
					model,
					{blocks: blocks});
			case 'RemoveBlocks':
				var blocks = msg.a;
				var nblocks = A2(author$project$Main$removeListBlocksFrom, model.blocks, blocks);
				return _Utils_update(
					model,
					{blocks: nblocks});
			case 'SelectBlock':
				var block = msg.a;
				return (!model.multipleSelect) ? _Utils_update(
					model,
					{
						selectedBlocks: _List_fromArray(
							[block.uuid])
					}) : (A2(elm$core$List$member, block.uuid, model.selectedBlocks) ? _Utils_update(
					model,
					{
						selectedBlocks: A2(
							elm$core$List$filter,
							elm$core$Basics$neq(block.uuid),
							model.selectedBlocks)
					}) : _Utils_update(
					model,
					{
						selectedBlocks: _Utils_ap(
							model.selectedBlocks,
							_List_fromArray(
								[block.uuid]))
					}));
			case 'SelectHullReference':
				var hullReference = msg.a;
				return _Utils_update(
					model,
					{
						selectedHullReference: elm$core$Maybe$Just(hullReference)
					});
			case 'SelectSlice':
				var hullReference = msg.a;
				var maxSelector = msg.b;
				var inputValue = msg.c;
				var olduiState = model.uiState;
				var updateUiState = function (newValue) {
					return _Utils_update(
						olduiState,
						{
							selectedSlice: A2(author$project$StringValueInput$asIntIn, olduiState.selectedSlice, newValue)
						});
				};
				var _n2 = elm$core$String$toInt(inputValue);
				if (_n2.$ === 'Nothing') {
					return model;
				} else {
					var _int = _n2.a;
					var _n3 = (!_int) || (_Utils_cmp(_int, maxSelector) > 0);
					if (_n3) {
						return model;
					} else {
						return _Utils_update(
							model,
							{
								uiState: updateUiState(_int)
							});
					}
				}
			case 'ToggleSlicesDetails':
				var isOpen = msg.a;
				var uiState = model.uiState;
				var newUiState = _Utils_update(
					uiState,
					{
						accordions: A3(elm$core$Dict$insert, 'hull-slices-details', isOpen, uiState.accordions),
						selectedSlice: A2(author$project$StringValueInput$asIntIn, uiState.selectedSlice, 1),
						showSelectedSlice: isOpen
					});
				return _Utils_update(
					model,
					{uiState: newUiState});
			case 'CreateHull':
				var updatedSlices = function (hullReference) {
					return A4(author$project$Main$insertIfUnique, hullReference, author$project$HullSlices$emptyHullSlices, model.slices, model.slices);
				};
				var uiState = model.uiState;
				var newUiState = _Utils_update(
					uiState,
					{newHullName: elm$core$Maybe$Nothing});
				var maybeHullReference = model.uiState.newHullName;
				if (maybeHullReference.$ === 'Nothing') {
					return model;
				} else {
					var hullReference = maybeHullReference.a;
					return A2(elm$core$Dict$member, hullReference, model.slices) ? model : _Utils_update(
						model,
						{
							selectedHullReference: elm$core$Maybe$Just(hullReference),
							slices: updatedSlices(hullReference),
							uiState: newUiState
						});
				}
			case 'RemoveHull':
				var hullReference = msg.a;
				return _Utils_update(
					model,
					{
						selectedHullReference: elm$core$Maybe$Nothing,
						slices: A2(elm$core$Dict$remove, hullReference, model.slices)
					});
			case 'UnselectHullReference':
				return _Utils_update(
					model,
					{selectedHullReference: elm$core$Maybe$Nothing});
			case 'ModifySlice':
				var modifier = msg.a;
				var hullReference = msg.b;
				var newValue = msg.c;
				return _Utils_update(
					model,
					{
						slices: A3(
							elm$core$Dict$update,
							hullReference,
							elm$core$Maybe$map(
								modifier(newValue)),
							model.slices)
					});
			case 'ResetSlice':
				var hullReference = msg.a;
				return _Utils_update(
					model,
					{
						slices: A3(
							elm$core$Dict$update,
							hullReference,
							elm$core$Maybe$map(author$project$HullSliceModifiers$resetSlicesToOriginals),
							model.slices)
					});
			case 'SetSpacingException':
				var partitionType = msg.a;
				var index = msg.b;
				var input = msg.c;
				var _n5 = function () {
					if (partitionType.$ === 'Deck') {
						return _Utils_Tuple2(model.partitions.decks, author$project$Main$asDecksInPartitions);
					} else {
						return _Utils_Tuple2(model.partitions.bulkheads, author$project$Main$asBulkheadsInPartitions);
					}
				}();
				var partition = _n5.a;
				var asPartitionInPartitions = _n5.b;
				var parsedInput = (input === '') ? elm$core$Maybe$Just(
					function ($) {
						return $.spacing;
					}(partition).value) : elm$core$String$toFloat(input);
				var previousException = A2(
					elm$core$Maybe$withDefault,
					function ($) {
						return $.spacing;
					}(partition),
					A2(
						elm$core$Dict$get,
						index,
						function ($) {
							return $.spacingExceptions;
						}(partition)));
				return A2(
					author$project$Main$asPartitionsInModel,
					model,
					A2(
						asPartitionInPartitions,
						model.partitions,
						A2(
							author$project$Main$asSpacingExceptionsInPartition,
							partition,
							function (floatInput) {
								return A3(
									elm$core$Dict$insert,
									index,
									floatInput,
									function ($) {
										return $.spacingExceptions;
									}(partition));
							}(
								function () {
									if (parsedInput.$ === 'Just') {
										var value = parsedInput.a;
										return A3(
											author$project$Main$flip,
											author$project$StringValueInput$asStringIn,
											input,
											A2(
												author$project$StringValueInput$asValueIn,
												previousException,
												elm$core$Basics$abs(value)));
									} else {
										return A2(author$project$StringValueInput$asStringIn, previousException, input);
									}
								}()))));
			case 'SwitchViewMode':
				var newViewMode = msg.a;
				var uiState = model.uiState;
				var newUiState = _Utils_update(
					uiState,
					{
						accordions: A3(elm$core$Dict$insert, 'hull-slices-details', false, uiState.accordions),
						showSelectedSlice: false
					});
				return _Utils_update(
					model,
					{uiState: newUiState, viewMode: newViewMode});
			case 'ToggleBlocksVisibility':
				var blocks = msg.a;
				var isVisible = msg.b;
				var updateVisibilityIfTargeted = F2(
					function (_n8, block) {
						return A2(elm$core$List$member, block, blocks) ? _Utils_update(
							block,
							{visible: isVisible}) : block;
					});
				return _Utils_update(
					model,
					{
						blocks: A2(author$project$DictList$map, updateVisibilityIfTargeted, model.blocks)
					});
			case 'TogglePartitions':
				var partitions = model.partitions;
				var updatedPartitions = _Utils_update(
					partitions,
					{showing: !partitions.showing});
				return _Utils_update(
					model,
					{partitions: updatedPartitions});
			case 'UpdatePartitionNumber':
				var partitionType = msg.a;
				var input = msg.b;
				var _n9 = function () {
					if (partitionType.$ === 'Deck') {
						return _Utils_Tuple2(
							function ($) {
								return $.decks;
							},
							author$project$Main$asDecksInPartitions);
					} else {
						return _Utils_Tuple2(
							function ($) {
								return $.bulkheads;
							},
							author$project$Main$asBulkheadsInPartitions);
					}
				}();
				var getPartition = _n9.a;
				var asPartitionInPartitions = _n9.b;
				return A2(
					author$project$Main$asPartitionsInModel,
					model,
					A2(
						asPartitionInPartitions,
						model.partitions,
						A2(
							author$project$Main$asNumberInPartition,
							getPartition(model.partitions),
							function () {
								var _n11 = elm$core$String$toInt(input);
								if (_n11.$ === 'Just') {
									var value = _n11.a;
									return A3(
										author$project$Main$flip,
										author$project$StringValueInput$asStringIn,
										input,
										A2(
											author$project$StringValueInput$asValueIn,
											getPartition(model.partitions).number,
											elm$core$Basics$abs(value)));
								} else {
									return A2(
										author$project$StringValueInput$asStringIn,
										getPartition(model.partitions).number,
										input);
								}
							}())));
			case 'UpdatePartitionSpacing':
				var partitionType = msg.a;
				var input = msg.b;
				var _n12 = function () {
					if (partitionType.$ === 'Deck') {
						return _Utils_Tuple2(
							function ($) {
								return $.decks;
							},
							author$project$Main$asDecksInPartitions);
					} else {
						return _Utils_Tuple2(
							function ($) {
								return $.bulkheads;
							},
							author$project$Main$asBulkheadsInPartitions);
					}
				}();
				var getPartition = _n12.a;
				var asPartitionInPartitions = _n12.b;
				return A2(
					author$project$Main$asPartitionsInModel,
					model,
					A2(
						asPartitionInPartitions,
						model.partitions,
						A2(
							author$project$Main$asSpacingInPartition,
							getPartition(model.partitions),
							function () {
								var _n14 = elm$core$String$toFloat(input);
								if (_n14.$ === 'Just') {
									var value = _n14.a;
									return A3(
										author$project$Main$flip,
										author$project$StringValueInput$asStringIn,
										input,
										A2(
											author$project$StringValueInput$asValueIn,
											getPartition(model.partitions).spacing,
											elm$core$Basics$abs(value)));
								} else {
									return A2(
										author$project$StringValueInput$asStringIn,
										getPartition(model.partitions).spacing,
										input);
								}
							}())));
			case 'UpdatePartitionZeroPosition':
				var partitionType = msg.a;
				var input = msg.b;
				var _n15 = function () {
					if (partitionType.$ === 'Deck') {
						return _Utils_Tuple2(
							function ($) {
								return $.decks;
							},
							author$project$Main$asDecksInPartitions);
					} else {
						return _Utils_Tuple2(
							function ($) {
								return $.bulkheads;
							},
							author$project$Main$asBulkheadsInPartitions);
					}
				}();
				var getPartition = _n15.a;
				var asPartitionInPartitions = _n15.b;
				return A2(
					author$project$Main$asPartitionsInModel,
					model,
					A2(
						asPartitionInPartitions,
						model.partitions,
						A2(
							author$project$Main$asZeroInPartition,
							getPartition(model.partitions),
							A2(
								author$project$Main$asPositionInPartitionZero,
								getPartition(model.partitions).zero,
								function () {
									var _n17 = elm$core$String$toFloat(input);
									if (_n17.$ === 'Just') {
										var value = _n17.a;
										return A3(
											author$project$Main$flip,
											author$project$StringValueInput$asStringIn,
											input,
											A2(
												author$project$StringValueInput$asValueIn,
												getPartition(model.partitions).spacing,
												value));
									} else {
										return A2(
											author$project$StringValueInput$asStringIn,
											getPartition(model.partitions).spacing,
											input);
									}
								}()))));
			case 'UpdatePosition':
				var axis = msg.a;
				var block = msg.b;
				var input = msg.c;
				var blockInModel = A2(
					elm$core$Maybe$withDefault,
					block,
					A2(author$project$Main$getBlockByUUID, block.uuid, model.blocks));
				var axisFloatInput = A2(author$project$Main$axisAccessor, axis, block.position);
				var updatedBlock = A2(
					author$project$Main$asPositionInBlock,
					blockInModel,
					A3(
						author$project$Main$asAxisInPosition,
						axis,
						blockInModel.position,
						A2(author$project$StringValueInput$setString, input, axisFloatInput)));
				return A2(author$project$Main$updateBlockInModel, updatedBlock, model);
			case 'UpdateDimension':
				var dimension = msg.a;
				var block = msg.b;
				var input = msg.c;
				var dimensionFloatInput = A2(author$project$Main$dimensionAccessor, dimension, block.size);
				var blockInModel = A2(
					elm$core$Maybe$withDefault,
					block,
					A2(author$project$Main$getBlockByUUID, block.uuid, model.blocks));
				var _n18 = elm$core$String$toFloat(input);
				if (_n18.$ === 'Just') {
					var value = _n18.a;
					var newValue = (!value) ? 0.1 : elm$core$Basics$abs(value);
					var updatedBlock = author$project$Main$updateBlockMassAndDensity(
						A2(
							author$project$Main$asSizeInBlock,
							blockInModel,
							A3(
								author$project$Main$asDimensionInSize,
								dimension,
								blockInModel.size,
								A3(
									author$project$Main$flip,
									author$project$StringValueInput$asStringIn,
									input,
									A2(author$project$StringValueInput$asValueIn, dimensionFloatInput, newValue)))));
					var newCenterOfVolume = (!updatedBlock.centerOfGravityFixed) ? author$project$Main$getRelativeCenterOfVolume(updatedBlock) : author$project$Main$getCenterOfGravity(blockInModel);
					var updatedBlockWithCog = _Utils_update(
						updatedBlock,
						{
							centerOfGravity: {
								x: A4(author$project$StringValueInput$fromNumber, 'm', 'x', 1, newCenterOfVolume.x),
								y: A4(author$project$StringValueInput$fromNumber, 'm', 'y', 1, newCenterOfVolume.y),
								z: A4(author$project$StringValueInput$fromNumber, 'm', 'z', 1, newCenterOfVolume.z)
							}
						});
					return A2(author$project$Main$updateBlockInModel, updatedBlockWithCog, model);
				} else {
					return A3(
						author$project$Main$flip,
						author$project$Main$updateBlockInModel,
						model,
						A2(
							author$project$Main$asSizeInBlock,
							blockInModel,
							A3(
								author$project$Main$asDimensionInSize,
								dimension,
								blockInModel.size,
								A2(author$project$StringValueInput$asStringIn, dimensionFloatInput, input))));
				}
			default:
				var updatedCoG = author$project$Main$getCentroidOfBlocks(model.blocks);
				return _Utils_update(
					model,
					{globalCenterOfGravity: updatedCoG});
		}
	});
var author$project$Main$updateToJs = F2(
	function (msg, model) {
		var updatedModel = A2(author$project$Main$updateModelToJs, msg, model);
		return _Utils_Tuple2(
			updatedModel,
			A2(author$project$Main$sendCmdToJs, updatedModel, msg));
	});
var author$project$Main$updateCentreOfGravity = function (_n0) {
	var model = _n0.a;
	var cmd = _n0.b;
	var _n1 = A2(author$project$Main$updateToJs, author$project$Main$UpdateGlobalCenterOfGravity, model);
	var updatedModel = _n1.a;
	var cmdUpdateCog = _n1.b;
	return _Utils_Tuple2(
		updatedModel,
		elm$core$Platform$Cmd$batch(
			_List_fromArray(
				[cmd, cmdUpdateCog])));
};
var author$project$HullSlices$fromHullSliceAsZYList = function (hsZYs) {
	return {
		x: hsZYs.x,
		y: A2(elm$core$List$map, elm$core$Tuple$second, hsZYs.zylist),
		zmax: A2(
			elm$core$Maybe$withDefault,
			1,
			elm$core$List$maximum(
				A2(elm$core$List$map, elm$core$Tuple$first, hsZYs.zylist))),
		zmin: A2(
			elm$core$Maybe$withDefault,
			0,
			elm$core$List$minimum(
				A2(elm$core$List$map, elm$core$Tuple$first, hsZYs.zylist)))
	};
};
var elm$core$List$sortBy = _List_sortBy;
var elm$core$Tuple$pair = F2(
	function (a, b) {
		return _Utils_Tuple2(a, b);
	});
var elm_community$list_extra$List$Extra$oneGroupWhileHelper = F3(
	function (condition, first, list) {
		if (!list.b) {
			return _Utils_Tuple2(_List_Nil, _List_Nil);
		} else {
			var second = list.a;
			var rest = list.b;
			if (A2(condition, first, second)) {
				var _n1 = A3(elm_community$list_extra$List$Extra$oneGroupWhileHelper, condition, second, rest);
				var thisGroup = _n1.a;
				var ungroupedRest = _n1.b;
				return _Utils_Tuple2(
					A2(elm$core$List$cons, second, thisGroup),
					ungroupedRest);
			} else {
				return _Utils_Tuple2(_List_Nil, list);
			}
		}
	});
var elm_community$list_extra$List$Extra$accumulateGroupWhile = F3(
	function (condition, list, accum) {
		accumulateGroupWhile:
		while (true) {
			if (!list.b) {
				return elm$core$List$reverse(accum);
			} else {
				var first = list.a;
				var rest = list.b;
				var _n1 = A3(elm_community$list_extra$List$Extra$oneGroupWhileHelper, condition, first, rest);
				var thisGroup = _n1.a;
				var ungroupedRest = _n1.b;
				var $temp$condition = condition,
					$temp$list = ungroupedRest,
					$temp$accum = A2(
					elm$core$List$cons,
					_Utils_Tuple2(first, thisGroup),
					accum);
				condition = $temp$condition;
				list = $temp$list;
				accum = $temp$accum;
				continue accumulateGroupWhile;
			}
		}
	});
var elm_community$list_extra$List$Extra$groupWhile = F2(
	function (condition, list) {
		return A3(elm_community$list_extra$List$Extra$accumulateGroupWhile, condition, list, _List_Nil);
	});
var author$project$HullSlices$fromCoordinates = function (xyzs) {
	var xyzsToHullSliceAsZYList = function (_n0) {
		var head = _n0.a;
		var tail = _n0.b;
		return author$project$HullSlices$fromHullSliceAsZYList(
			{
				x: head.x,
				zylist: A2(
					elm$core$List$map,
					function (c) {
						return A2(elm$core$Tuple$pair, c.z, c.y);
					},
					A2(elm$core$List$cons, head, tail))
			});
	};
	return A2(
		elm$core$List$map,
		xyzsToHullSliceAsZYList,
		A2(
			elm_community$list_extra$List$Extra$groupWhile,
			F2(
				function (a, b) {
					return _Utils_eq(a.x, b.x);
				}),
			A2(
				elm$core$List$sortBy,
				function ($) {
					return $.x;
				},
				xyzs)));
};
var elm$core$Maybe$map2 = F3(
	function (func, ma, mb) {
		if (ma.$ === 'Nothing') {
			return elm$core$Maybe$Nothing;
		} else {
			var a = ma.a;
			if (mb.$ === 'Nothing') {
				return elm$core$Maybe$Nothing;
			} else {
				var b = mb.a;
				return elm$core$Maybe$Just(
					A2(func, a, b));
			}
		}
	});
var elm$core$Maybe$map5 = F6(
	function (func, ma, mb, mc, md, me) {
		if (ma.$ === 'Nothing') {
			return elm$core$Maybe$Nothing;
		} else {
			var a = ma.a;
			if (mb.$ === 'Nothing') {
				return elm$core$Maybe$Nothing;
			} else {
				var b = mb.a;
				if (mc.$ === 'Nothing') {
					return elm$core$Maybe$Nothing;
				} else {
					var c = mc.a;
					if (md.$ === 'Nothing') {
						return elm$core$Maybe$Nothing;
					} else {
						var d = md.a;
						if (me.$ === 'Nothing') {
							return elm$core$Maybe$Nothing;
						} else {
							var e = me.a;
							return elm$core$Maybe$Just(
								A5(func, a, b, c, d, e));
						}
					}
				}
			}
		}
	});
var author$project$HullSlices$getSpaceParametersFromHullSlices = function (hullSliceList) {
	var maybeZmin = elm$core$List$minimum(
		A2(
			elm$core$List$map,
			function ($) {
				return $.zmin;
			},
			hullSliceList));
	var maybeZmax = elm$core$List$maximum(
		A2(
			elm$core$List$map,
			function ($) {
				return $.zmax;
			},
			hullSliceList));
	var maybeYmin = elm$core$List$minimum(
		elm$core$List$concat(
			A2(
				elm$core$List$map,
				function ($) {
					return $.y;
				},
				hullSliceList)));
	var maybeYmax = elm$core$List$maximum(
		elm$core$List$concat(
			A2(
				elm$core$List$map,
				function ($) {
					return $.y;
				},
				hullSliceList)));
	var maybeXmin = elm$core$List$minimum(
		A2(
			elm$core$List$map,
			function ($) {
				return $.x;
			},
			hullSliceList));
	var maybeXmax = elm$core$List$maximum(
		A2(
			elm$core$List$map,
			function ($) {
				return $.x;
			},
			hullSliceList));
	var maybeLength = A3(elm$core$Maybe$map2, elm$core$Basics$sub, maybeXmax, maybeXmin);
	var maybeDepth = A3(elm$core$Maybe$map2, elm$core$Basics$sub, maybeZmax, maybeZmin);
	var maybeBreadth = A3(
		elm$core$Maybe$map2,
		elm$core$Basics$mul,
		elm$core$Maybe$Just(2),
		A3(elm$core$Maybe$map2, elm$core$Basics$sub, maybeYmax, maybeYmin));
	var addSpaceParameters = F5(
		function (length, breadth, draught, xmin, zmin) {
			return {breadth: breadth, depth: draught, length: length, xmin: xmin, zmin: zmin};
		});
	return A6(elm$core$Maybe$map5, addSpaceParameters, maybeLength, maybeBreadth, maybeDepth, maybeXmin, maybeZmin);
};
var author$project$HullSlices$normalizeHullSlice = F2(
	function (param, hs) {
		var x = (hs.x / param.length) - param.xmin;
		var normalizedZ = F3(
			function (zmin, depth, z) {
				return (z / depth) - (zmin / depth);
			});
		var normalizedY = F2(
			function (br, y) {
				return ((y / (br / 2)) / 2) + 0.5;
			});
		var hs_zmin = A3(normalizedZ, param.zmin, param.depth, hs.zmin);
		var hs_zmax = A3(normalizedZ, param.zmin, param.depth, hs.zmax);
		var hs_y = A2(
			elm$core$List$map,
			normalizedY(param.breadth),
			hs.y);
		var res = {x: x, y: hs_y, zmax: hs_zmax, zmin: hs_zmin};
		return res;
	});
var author$project$HullSlices$normalizeHullSlices = F2(
	function (hullSliceList, param) {
		return A2(
			elm$core$List$map,
			author$project$HullSlices$normalizeHullSlice(param),
			hullSliceList);
	});
var author$project$Main$DetailedBlock = function (a) {
	return {$: 'DetailedBlock', a: a};
};
var author$project$Main$OriginDefinition = function (a) {
	return {$: 'OriginDefinition', a: a};
};
var author$project$Main$Partitioning = function (a) {
	return {$: 'Partitioning', a: a};
};
var author$project$Main$PropertiesEdition = {$: 'PropertiesEdition'};
var author$project$Main$SpaceReservation = function (a) {
	return {$: 'SpaceReservation', a: a};
};
var author$project$Main$asIndexInPartitionZero = F2(
	function (zero, newIndex) {
		return _Utils_update(
			zero,
			{index: newIndex});
	});
var author$project$Main$renameKey = F2(
	function (model, key) {
		var findSingleKey = function (originalKey) {
			findSingleKey:
			while (true) {
				if (!A2(elm$core$Dict$member, originalKey, model.slices)) {
					return originalKey;
				} else {
					var $temp$originalKey = originalKey + ' - bis';
					originalKey = $temp$originalKey;
					continue findSingleKey;
				}
			}
		};
		return findSingleKey(key);
	});
var author$project$Main$importHullsLibraryiInModel = F2(
	function (model, saveFile) {
		var insertBothWithoutColision = F3(
			function (key, a, b) {
				return A2(
					elm$core$Basics$composeL,
					A2(elm$core$Dict$insert, key, a),
					A3(
						author$project$Main$insertIfUnique,
						A2(author$project$Main$renameKey, model, key),
						b,
						model.slices));
			});
		var importedHullsLibrary = A2(
			elm$core$Dict$map,
			F2(
				function (_n0, val) {
					return author$project$HullSliceModifiers$resetSlicesToOriginals(val);
				}),
			saveFile.hulls);
		var updatedSlices = function () {
			var ifHullOnlyInSavedFile = F2(
				function (key, value) {
					return A3(author$project$Main$insertIfUnique, key, value, model.slices);
				});
			var ifHullOnlyInModel = elm$core$Dict$insert;
			var ifHullInModelAndInSavedFile = insertBothWithoutColision;
			return A6(elm$core$Dict$merge, ifHullOnlyInModel, ifHullInModelAndInSavedFile, ifHullOnlyInSavedFile, model.slices, importedHullsLibrary, elm$core$Dict$empty);
		}();
		return _Utils_update(
			model,
			{slices: updatedSlices});
	});
var author$project$Main$encodeBlocks = function (blocks) {
	return author$project$Main$encodeListBlocks(
		author$project$Main$toList(blocks));
};
var author$project$Main$encodeRestoreSaveCmd = function (model) {
	var currentHullSlices = function () {
		var _n0 = model.selectedHullReference;
		if (_n0.$ === 'Nothing') {
			return elm$json$Json$Encode$string('');
		} else {
			var hullName = _n0.a;
			var _n1 = A2(elm$core$Dict$get, hullName, model.slices);
			if (_n1.$ === 'Nothing') {
				return elm$json$Json$Encode$string('');
			} else {
				var hullSlices = _n1.a;
				return A3(
					author$project$EncodersDecoders$encoderWithSelectedSlice,
					model.uiState.selectedSlice.value,
					model.uiState.showSelectedSlice,
					author$project$HullSlices$applyCustomPropertiesToHullSlices(hullSlices));
			}
		}
	}();
	return elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'viewMode',
				author$project$Main$encodeViewMode(model.viewMode)),
				_Utils_Tuple2(
				'coordinatesTransform',
				author$project$CoordinatesTransform$encode(model.coordinatesTransform)),
				_Utils_Tuple2('hull', currentHullSlices),
				_Utils_Tuple2(
				'blocks',
				author$project$Main$encodeBlocks(model.blocks)),
				_Utils_Tuple2(
				'showingPartitions',
				elm$json$Json$Encode$bool(model.partitions.showing)),
				_Utils_Tuple2(
				'decks',
				author$project$Main$encodeComputedPartitions(
					author$project$Main$computeDecks(model.partitions.decks))),
				_Utils_Tuple2(
				'bulkheads',
				author$project$Main$encodeComputedPartitions(
					author$project$Main$computeBulkheads(model.partitions.bulkheads)))
			]));
};
var author$project$Main$restoreSaveCmd = function (model) {
	return {
		data: author$project$Main$encodeRestoreSaveCmd(model),
		tag: 'restore-save'
	};
};
var author$project$CoordinatesTransform$fromList = function (listOfTransforms) {
	if (((((((((listOfTransforms.b && listOfTransforms.b.b) && listOfTransforms.b.b.b) && listOfTransforms.b.b.b.b) && listOfTransforms.b.b.b.b.b) && listOfTransforms.b.b.b.b.b.b) && listOfTransforms.b.b.b.b.b.b.b) && listOfTransforms.b.b.b.b.b.b.b.b) && listOfTransforms.b.b.b.b.b.b.b.b.b) && (!listOfTransforms.b.b.b.b.b.b.b.b.b.b)) {
		var xx = listOfTransforms.a;
		var _n1 = listOfTransforms.b;
		var yx = _n1.a;
		var _n2 = _n1.b;
		var zx = _n2.a;
		var _n3 = _n2.b;
		var xy = _n3.a;
		var _n4 = _n3.b;
		var yy = _n4.a;
		var _n5 = _n4.b;
		var zy = _n5.a;
		var _n6 = _n5.b;
		var xz = _n6.a;
		var _n7 = _n6.b;
		var yz = _n7.a;
		var _n8 = _n7.b;
		var zz = _n8.a;
		return elm$core$Maybe$Just(
			A3(
				author$project$CoordinatesTransform$fromVectors,
				A3(elm_explorations$linear_algebra$Math$Vector3$vec3, xx, xy, xz),
				A3(elm_explorations$linear_algebra$Math$Vector3$vec3, yx, yy, yz),
				A3(elm_explorations$linear_algebra$Math$Vector3$vec3, zx, zy, zz)));
	} else {
		return elm$core$Maybe$Nothing;
	}
};
var author$project$EncodersDecoders$dictEncoder = function (hullDict) {
	return elm$json$Json$Encode$object(
		A2(
			elm$core$List$map,
			function (_n0) {
				var key = _n0.a;
				var slices = _n0.b;
				return _Utils_Tuple2(
					key,
					author$project$EncodersDecoders$encoder(slices));
			},
			elm$core$Dict$toList(hullDict)));
};
var author$project$Main$fromList = function (l) {
	var append = F2(
		function (_n0, dict) {
			var key = _n0.a;
			var value = _n0.b;
			return A3(author$project$DictList$insert, key, value, dict);
		});
	return A3(elm$core$List$foldr, append, author$project$DictList$empty, l);
};
var author$project$Main$listOfBlocksToBlocks = function (blockList) {
	return author$project$Main$fromList(
		A2(
			elm$core$List$map,
			function (block) {
				return _Utils_Tuple2(block.uuid, block);
			},
			blockList));
};
var author$project$Main$restoreSaveInModel = F2(
	function (model, saveFile) {
		var tags = saveFile.tags;
		var savedSelectedHullReference = saveFile.selectedHullReference;
		var savedHull = saveFile.hulls;
		var savedBlocks = author$project$Main$listOfBlocksToBlocks(saveFile.blocks);
		var partitions = saveFile.partitions;
		var maybeCoordinatesTransform = author$project$CoordinatesTransform$fromList(saveFile.coordinatesTransform);
		var customProperties = saveFile.customProperties;
		var cleanModel = author$project$Main$initModel(
			{
				buildSHA: model.build,
				hullsJSON: A2(
					elm$json$Json$Encode$encode,
					0,
					author$project$EncodersDecoders$dictEncoder(model.slices))
			});
		if (maybeCoordinatesTransform.$ === 'Just') {
			var savedCoordinatesTransform = maybeCoordinatesTransform.a;
			return _Utils_update(
				cleanModel,
				{blocks: savedBlocks, coordinatesTransform: savedCoordinatesTransform, currentDate: model.currentDate, customProperties: customProperties, partitions: partitions, selectedHullReference: savedSelectedHullReference, slices: savedHull, tags: tags});
		} else {
			return model;
		}
	});
var elm$browser$Browser$Dom$focus = _Browser_call('focus');
var elm$core$Task$onError = _Scheduler_onError;
var elm$core$Task$attempt = F2(
	function (resultToMessage, task) {
		return elm$core$Task$command(
			elm$core$Task$Perform(
				A2(
					elm$core$Task$onError,
					A2(
						elm$core$Basics$composeL,
						A2(elm$core$Basics$composeL, elm$core$Task$succeed, resultToMessage),
						elm$core$Result$Err),
					A2(
						elm$core$Task$andThen,
						A2(
							elm$core$Basics$composeL,
							A2(elm$core$Basics$composeL, elm$core$Task$succeed, resultToMessage),
							elm$core$Result$Ok),
						task))));
	});
var author$project$Main$updateFromJs = F2(
	function (jsmsg, model) {
		switch (jsmsg.$) {
			case 'AddToSelection':
				var uuid = jsmsg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							selectedBlocks: _Utils_ap(
								model.selectedBlocks,
								_List_fromArray(
									[uuid]))
						}),
					elm$core$Platform$Cmd$none);
			case 'RemoveFromSelection':
				var uuid = jsmsg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							selectedBlocks: A2(
								elm$core$List$filter,
								elm$core$Basics$neq(uuid),
								model.selectedBlocks)
						}),
					elm$core$Platform$Cmd$none);
			case 'NewBlock':
				var block = jsmsg.a;
				var blocks = A2(
					author$project$Main$addBlockTo,
					model.blocks,
					author$project$Main$updateBlockCenterOfGravity(block));
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{blocks: blocks}),
					elm$core$Platform$Cmd$batch(
						_List_fromArray(
							[
								A2(
								elm$core$Task$attempt,
								function (_n1) {
									return author$project$Main$NoJs(author$project$Main$NoOp);
								},
								elm$browser$Browser$Dom$focus(block.uuid))
							])));
			case 'RestoreSave':
				var saveFile = jsmsg.a;
				var newModel = A2(author$project$Main$restoreSaveInModel, model, saveFile);
				return _Utils_Tuple2(
					newModel,
					elm$core$Platform$Cmd$batch(
						_List_fromArray(
							[
								author$project$Main$toJs(
								author$project$Main$restoreSaveCmd(newModel))
							])));
			case 'ImportHullsLibrary':
				var saveFile = jsmsg.a;
				var newModel = A2(author$project$Main$importHullsLibraryiInModel, model, saveFile);
				return _Utils_Tuple2(newModel, elm$core$Platform$Cmd$none);
			case 'PasteClipBoard':
				var coordinates = jsmsg.a;
				var _n2 = model.selectedHullReference;
				if (_n2.$ === 'Just') {
					var hullRef = _n2.a;
					var updateHullslices = function (hullslices) {
						var denormalizedSlices = author$project$HullSlices$fromCoordinates(coordinates);
						var _n4 = author$project$HullSlices$getSpaceParametersFromHullSlices(denormalizedSlices);
						if (_n4.$ === 'Just') {
							var param = _n4.a;
							var normalizedSlices = A2(author$project$HullSlices$normalizeHullSlices, denormalizedSlices, param);
							return author$project$HullSliceModifiers$resetSlicesToOriginals(
								_Utils_update(
									hullslices,
									{
										breadth: A2(author$project$StringValueInput$asFloatIn, hullslices.breadth, param.breadth),
										depth: A2(author$project$StringValueInput$asFloatIn, hullslices.depth, param.depth),
										length: A2(author$project$StringValueInput$asFloatIn, hullslices.length, param.length),
										originalSlicePositions: A2(
											elm$core$List$map,
											function ($) {
												return $.x;
											},
											normalizedSlices),
										slices: normalizedSlices,
										xmin: param.xmin,
										zmin: param.zmin
									}));
						} else {
							return hullslices;
						}
					};
					var olduiState = model.uiState;
					var updateUiState = function (isWaiting) {
						return _Utils_update(
							olduiState,
							{waitToPasteClipBoard: isWaiting});
					};
					var updatedModel = _Utils_update(
						model,
						{
							slices: A3(
								elm$core$Dict$update,
								hullRef,
								elm$core$Maybe$map(updateHullslices),
								model.slices),
							uiState: updateUiState(false)
						});
					var loadhullCmd = function () {
						var _n3 = A2(author$project$Main$loadHullJsData, updatedModel, hullRef);
						if (_n3.$ === 'Just') {
							var jsData = _n3.a;
							return author$project$Main$toJs(jsData);
						} else {
							return elm$core$Platform$Cmd$none;
						}
					}();
					return _Utils_Tuple2(updatedModel, loadhullCmd);
				} else {
					return _Utils_Tuple2(model, elm$core$Platform$Cmd$none);
				}
			case 'Select':
				var uuid = jsmsg.a;
				var updatedViewMode = function () {
					var _n5 = model.viewMode;
					if ((_n5.$ === 'SpaceReservation') && (_n5.a.$ === 'DetailedBlock')) {
						return author$project$Main$SpaceReservation(
							author$project$Main$DetailedBlock(uuid));
					} else {
						var otherViewMode = _n5;
						return otherViewMode;
					}
				}();
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							selectedBlocks: _List_fromArray(
								[uuid]),
							viewMode: updatedViewMode
						}),
					elm$core$Platform$Cmd$none);
			case 'SelectPartition':
				var partitionType = jsmsg.a;
				var index = jsmsg.b;
				var position = jsmsg.c;
				if (_Utils_eq(
					model.viewMode,
					author$project$Main$Partitioning(
						author$project$Main$OriginDefinition(partitionType)))) {
					var _n6 = function () {
						if (partitionType.$ === 'Deck') {
							return _Utils_Tuple2(
								A2(
									elm$core$Basics$composeR,
									function ($) {
										return $.partitions;
									},
									function ($) {
										return $.decks;
									}),
								author$project$Main$asDecksInPartitions(model.partitions));
						} else {
							return _Utils_Tuple2(
								A2(
									elm$core$Basics$composeR,
									function ($) {
										return $.partitions;
									},
									function ($) {
										return $.bulkheads;
									}),
								author$project$Main$asBulkheadsInPartitions(model.partitions));
						}
					}();
					var partition = _n6.a;
					var updatePartition = _n6.b;
					var updatedModel = ((_Utils_cmp(
						index,
						function ($) {
							return $.number;
						}(
							partition(model)).value) < 0) && (index >= 0)) ? _Utils_update(
						model,
						{
							partitions: updatePartition(
								A2(
									author$project$Main$asZeroInPartition,
									partition(model),
									A3(
										author$project$Main$flip,
										author$project$Main$asPositionInPartitionZero,
										A4(author$project$StringValueInput$fromNumber, 'm', 'Position', 1, position),
										A2(
											author$project$Main$asIndexInPartitionZero,
											partition(model).zero,
											index)))),
							viewMode: author$project$Main$Partitioning(author$project$Main$PropertiesEdition)
						}) : model;
					var _n8 = function () {
						if (partitionType.$ === 'Deck') {
							return _Utils_Tuple2('make-decks', author$project$Main$computeDecks);
						} else {
							return _Utils_Tuple2('make-bulkheads', author$project$Main$computeBulkheads);
						}
					}();
					var tag = _n8.a;
					var computePartition = _n8.b;
					var jsCmd = author$project$Main$toJs(
						{
							data: author$project$Main$encodeComputedPartitions(
								computePartition(
									partition(updatedModel))),
							tag: tag
						});
					return _Utils_Tuple2(updatedModel, jsCmd);
				} else {
					return _Utils_Tuple2(model, elm$core$Platform$Cmd$none);
				}
			case 'Unselect':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{selectedBlocks: _List_Nil}),
					elm$core$Platform$Cmd$none);
			case 'SynchronizePosition':
				var uuid = jsmsg.a;
				var position = jsmsg.b;
				return _Utils_Tuple2(
					function () {
						var _n10 = A2(author$project$Main$getBlockByUUID, uuid, model.blocks);
						if (_n10.$ === 'Just') {
							var block = _n10.a;
							return A3(
								author$project$Main$flip,
								author$project$Main$updateBlockInModel,
								model,
								A2(author$project$Main$asPositionInBlock, block, position));
						} else {
							return model;
						}
					}(),
					elm$core$Platform$Cmd$none);
			case 'SynchronizePositions':
				var syncDict = jsmsg.a;
				var updatedBlocks = A2(
					author$project$DictList$map,
					F2(
						function (uuid, block) {
							var _n11 = A2(elm$core$Dict$get, uuid, syncDict);
							if (_n11.$ === 'Just') {
								var syncPosition = _n11.a;
								return A2(author$project$Main$asPositionInBlock, block, syncPosition.position);
							} else {
								return block;
							}
						}),
					model.blocks);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{blocks: updatedBlocks}),
					elm$core$Platform$Cmd$none);
			case 'SynchronizeSize':
				var uuid = jsmsg.a;
				var size = jsmsg.b;
				return _Utils_Tuple2(
					function () {
						var _n12 = A2(author$project$Main$getBlockByUUID, uuid, model.blocks);
						if (_n12.$ === 'Just') {
							var block = _n12.a;
							var updatedBlock = author$project$Main$updateBlockMassAndDensity(
								A2(author$project$Main$asSizeInBlock, block, size));
							var newCenterOfVolume = (!block.centerOfGravityFixed) ? author$project$Main$getRelativeCenterOfVolume(updatedBlock) : author$project$Main$getCenterOfGravity(updatedBlock);
							var updatedBlockWithCog = _Utils_update(
								updatedBlock,
								{
									centerOfGravity: {
										x: A4(author$project$StringValueInput$fromNumber, 'm', 'x', 1, newCenterOfVolume.x),
										y: A4(author$project$StringValueInput$fromNumber, 'm', 'y', 1, newCenterOfVolume.y),
										z: A4(author$project$StringValueInput$fromNumber, 'm', 'z', 1, newCenterOfVolume.z)
									}
								});
							return A2(author$project$Main$updateBlockInModel, updatedBlockWithCog, model);
						} else {
							return model;
						}
					}(),
					elm$core$Platform$Cmd$none);
			default:
				return _Utils_Tuple2(model, elm$core$Platform$Cmd$none);
		}
	});
var author$project$AllDictList$equalKeys = F3(
	function (key1, key2, dict) {
		var ord = author$project$Dict$Any$getOrd(dict);
		return _Utils_eq(
			ord(key1),
			ord(key2));
	});
var elm_community$list_extra$List$Extra$findIndexHelp = F3(
	function (index, predicate, list) {
		findIndexHelp:
		while (true) {
			if (!list.b) {
				return elm$core$Maybe$Nothing;
			} else {
				var x = list.a;
				var xs = list.b;
				if (predicate(x)) {
					return elm$core$Maybe$Just(index);
				} else {
					var $temp$index = index + 1,
						$temp$predicate = predicate,
						$temp$list = xs;
					index = $temp$index;
					predicate = $temp$predicate;
					list = $temp$list;
					continue findIndexHelp;
				}
			}
		}
	});
var elm_community$list_extra$List$Extra$findIndex = elm_community$list_extra$List$Extra$findIndexHelp(0);
var author$project$AllDictList$insertAfter = F4(
	function (afterKey, key, value, _n0) {
		var dict = _n0.a;
		var list = _n0.b;
		var newList = function () {
			if (A2(author$project$Dict$Any$member, afterKey, dict)) {
				if (A3(author$project$AllDictList$equalKeys, key, afterKey, dict)) {
					return list;
				} else {
					var ord = author$project$Dict$Any$getOrd(dict);
					var listWithoutKey = A3(author$project$AllDictList$removeKey, key, dict, list);
					var afterKeyComparable = ord(afterKey);
					var _n1 = A2(
						elm_community$list_extra$List$Extra$findIndex,
						function (k) {
							return _Utils_eq(
								ord(k),
								afterKeyComparable);
						},
						listWithoutKey);
					if (_n1.$ === 'Just') {
						var index = _n1.a;
						return _Utils_ap(
							A2(elm$core$List$take, index + 1, listWithoutKey),
							A2(
								elm$core$List$cons,
								key,
								A2(elm$core$List$drop, index + 1, listWithoutKey)));
					} else {
						return _List_Nil;
					}
				}
			} else {
				return _Utils_ap(
					A3(author$project$AllDictList$removeKey, key, dict, list),
					_List_fromArray(
						[key]));
			}
		}();
		var newDict = A3(author$project$Dict$Any$insert, key, value, dict);
		return A2(author$project$AllDictList$AllDictList, newDict, newList);
	});
var author$project$DictList$insertAfter = author$project$AllDictList$insertAfter;
var author$project$AllDictList$insertBefore = F4(
	function (beforeKey, key, value, _n0) {
		var dict = _n0.a;
		var list = _n0.b;
		var newList = function () {
			if (A2(author$project$Dict$Any$member, beforeKey, dict)) {
				if (A3(author$project$AllDictList$equalKeys, key, beforeKey, dict)) {
					return list;
				} else {
					var ord = author$project$Dict$Any$getOrd(dict);
					var listWithoutKey = A3(author$project$AllDictList$removeKey, key, dict, list);
					var beforeKeyComparable = ord(beforeKey);
					var _n1 = A2(
						elm_community$list_extra$List$Extra$findIndex,
						function (k) {
							return _Utils_eq(
								ord(k),
								beforeKeyComparable);
						},
						listWithoutKey);
					if (_n1.$ === 'Just') {
						var index = _n1.a;
						return _Utils_ap(
							A2(elm$core$List$take, index, listWithoutKey),
							A2(
								elm$core$List$cons,
								key,
								A2(elm$core$List$drop, index, listWithoutKey)));
					} else {
						return _List_Nil;
					}
				}
			} else {
				return A2(
					elm$core$List$cons,
					key,
					A3(author$project$AllDictList$removeKey, key, dict, list));
			}
		}();
		var newDict = A3(author$project$Dict$Any$insert, key, value, dict);
		return A2(author$project$AllDictList$AllDictList, newDict, newList);
	});
var author$project$DictList$insertBefore = author$project$AllDictList$insertBefore;
var elm_community$list_extra$List$Extra$getAt = F2(
	function (idx, xs) {
		return (idx < 0) ? elm$core$Maybe$Nothing : elm$core$List$head(
			A2(elm$core$List$drop, idx, xs));
	});
var author$project$AllDictList$getAt = F2(
	function (index, _n0) {
		var dict = _n0.a;
		var list = _n0.b;
		return A2(
			elm$core$Maybe$andThen,
			function (key) {
				return A2(
					elm$core$Maybe$map,
					function (value) {
						return _Utils_Tuple2(key, value);
					},
					A2(author$project$Dict$Any$get, key, dict));
			},
			A2(elm_community$list_extra$List$Extra$getAt, index, list));
	});
var author$project$AllDictList$indexOfKey = F2(
	function (key, _n0) {
		var dict = _n0.a;
		var list = _n0.b;
		var ord = author$project$Dict$Any$getOrd(dict);
		var target = ord(key);
		return A2(
			elm_community$list_extra$List$Extra$findIndex,
			function (k) {
				return _Utils_eq(
					ord(k),
					target);
			},
			list);
	});
var author$project$AllDictList$next = F2(
	function (key, dictlist) {
		return A2(
			elm$core$Maybe$andThen,
			function (index) {
				return A2(author$project$AllDictList$getAt, index + 1, dictlist);
			},
			A2(author$project$AllDictList$indexOfKey, key, dictlist));
	});
var author$project$DictList$next = author$project$AllDictList$next;
var author$project$AllDictList$previous = F2(
	function (key, dictlist) {
		return A2(
			elm$core$Maybe$andThen,
			function (index) {
				return A2(author$project$AllDictList$getAt, index - 1, dictlist);
			},
			A2(author$project$AllDictList$indexOfKey, key, dictlist));
	});
var author$project$DictList$previous = author$project$AllDictList$previous;
var author$project$Main$addToast = F2(
	function (newToast, toasts) {
		return A3(author$project$DictList$insert, newToast.key, newToast, toasts);
	});
var author$project$Main$removeToast = F2(
	function (keyToRemove, toasts) {
		return A2(author$project$DictList$remove, keyToRemove, toasts);
	});
var author$project$Main$renameBlock = F2(
	function (label, block) {
		return _Utils_update(
			block,
			{label: label});
	});
var author$project$SIRColorPicker$amber = A3(avh4$elm_color$Color$rgb, 255, 193, 7);
var author$project$SIRColorPicker$black = A3(avh4$elm_color$Color$rgb, 0, 0, 0);
var author$project$SIRColorPicker$blue = A3(avh4$elm_color$Color$rgb, 33, 150, 243);
var author$project$SIRColorPicker$brown = A3(avh4$elm_color$Color$rgb, 121, 85, 72);
var author$project$SIRColorPicker$cyan = A3(avh4$elm_color$Color$rgb, 0, 188, 212);
var author$project$SIRColorPicker$deepOrange = A3(avh4$elm_color$Color$rgb, 255, 87, 34);
var author$project$SIRColorPicker$deepPurple = A3(avh4$elm_color$Color$rgb, 103, 58, 183);
var author$project$SIRColorPicker$green = A3(avh4$elm_color$Color$rgb, 76, 175, 80);
var author$project$SIRColorPicker$lightBlue = A3(avh4$elm_color$Color$rgb, 3, 169, 244);
var author$project$SIRColorPicker$lightGreen = A3(avh4$elm_color$Color$rgb, 139, 195, 74);
var author$project$SIRColorPicker$lime = A3(avh4$elm_color$Color$rgb, 205, 220, 57);
var author$project$SIRColorPicker$orange = A3(avh4$elm_color$Color$rgb, 255, 152, 0);
var author$project$SIRColorPicker$pink = A3(avh4$elm_color$Color$rgb, 233, 30, 99);
var author$project$SIRColorPicker$purple = A3(avh4$elm_color$Color$rgb, 156, 39, 176);
var author$project$SIRColorPicker$red = A3(avh4$elm_color$Color$rgb, 244, 67, 54);
var author$project$SIRColorPicker$teal = A3(avh4$elm_color$Color$rgb, 0, 150, 136);
var author$project$SIRColorPicker$yellow = A3(avh4$elm_color$Color$rgb, 255, 235, 59);
var author$project$SIRColorPicker$getColor = function (sirColor) {
	switch (sirColor.$) {
		case 'Red':
			return author$project$SIRColorPicker$red;
		case 'Pink':
			return author$project$SIRColorPicker$pink;
		case 'Purple':
			return author$project$SIRColorPicker$purple;
		case 'DeepPurple':
			return author$project$SIRColorPicker$deepPurple;
		case 'Indigo':
			return author$project$SIRColorPicker$indigo;
		case 'Blue':
			return author$project$SIRColorPicker$blue;
		case 'LightBlue':
			return author$project$SIRColorPicker$lightBlue;
		case 'Cyan':
			return author$project$SIRColorPicker$cyan;
		case 'Teal':
			return author$project$SIRColorPicker$teal;
		case 'Green':
			return author$project$SIRColorPicker$green;
		case 'LightGreen':
			return author$project$SIRColorPicker$lightGreen;
		case 'Lime':
			return author$project$SIRColorPicker$lime;
		case 'Yellow':
			return author$project$SIRColorPicker$yellow;
		case 'Amber':
			return author$project$SIRColorPicker$amber;
		case 'Orange':
			return author$project$SIRColorPicker$orange;
		case 'DeepOrange':
			return author$project$SIRColorPicker$deepOrange;
		case 'Brown':
			return author$project$SIRColorPicker$brown;
		default:
			return author$project$SIRColorPicker$black;
	}
};
var author$project$SIRColorPicker$fromColor = function (color) {
	return elm$core$List$head(
		A2(
			elm$core$List$filter,
			A2(
				elm$core$Basics$composeL,
				elm$core$Basics$eq(color),
				author$project$SIRColorPicker$getColor),
			author$project$SIRColorPicker$palette));
};
var author$project$StringValueInput$syncFloatInput = function (input) {
	return _Utils_update(
		input,
		{
			string: elm$core$String$fromFloat(input.value)
		});
};
var author$project$StringValueInput$syncIntInput = function (input) {
	return _Utils_update(
		input,
		{
			string: elm$core$String$fromInt(input.value)
		});
};
var elm$core$String$filter = _String_filter;
var author$project$Main$updateNoJs = F2(
	function (msg, model) {
		switch (msg.$) {
			case 'AddCustomProperty':
				var label = msg.a;
				var updatedCustomProperties = _Utils_ap(
					model.customProperties,
					_List_fromArray(
						[
							{label: label, values: elm$core$Dict$empty}
						]));
				var newCustomPropertyId = 'custom-property-' + elm$core$String$fromInt(
					elm$core$List$length(updatedCustomProperties));
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{customProperties: updatedCustomProperties}),
					elm$core$Platform$Cmd$batch(
						_List_fromArray(
							[
								A2(
								elm$core$Task$attempt,
								function (_n1) {
									return author$project$Main$NoJs(author$project$Main$NoOp);
								},
								elm$browser$Browser$Dom$focus(newCustomPropertyId))
							])));
			case 'CleanTags':
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							tags: A2(
								elm$core$List$filter,
								A2(
									elm$core$Basics$composeL,
									A2(
										elm$core$Basics$composeL,
										elm$core$Basics$neq(0),
										elm$core$String$length),
									function ($) {
										return $.label;
									}),
								model.tags)
						}),
					elm$core$Platform$Cmd$none);
			case 'DeleteCustomProperty':
				var property = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							customProperties: A2(
								elm$core$List$filter,
								elm$core$Basics$neq(property),
								model.customProperties)
						}),
					elm$core$Platform$Cmd$none);
			case 'DismissToast':
				var keyToDismiss = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							toasts: A2(author$project$Main$removeToast, keyToDismiss, model.toasts)
						}),
					elm$core$Platform$Cmd$none);
			case 'DisplayToast':
				var toast = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							toasts: A2(author$project$Main$addToast, toast, model.toasts)
						}),
					elm$core$Platform$Cmd$none);
			case 'LockCenterOfGravityToCenterOfVolume':
				var block = msg.a;
				var updatedBlock = author$project$Main$updateBlockCenterOfGravity(block);
				var updatedBlockUnfixed = _Utils_update(
					updatedBlock,
					{centerOfGravityFixed: false});
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							blocks: A2(author$project$Main$updateBlockInBlocks, updatedBlockUnfixed, model.blocks)
						}),
					elm$core$Platform$Cmd$none);
			case 'MoveBlockDown':
				var block = msg.a;
				var maybeNext = A2(author$project$DictList$next, block.uuid, model.blocks);
				var updatedBlocks = A2(
					elm$core$Maybe$withDefault,
					model.blocks,
					A2(
						elm$core$Maybe$map,
						function (next) {
							return A4(author$project$DictList$insertAfter, next.a, block.uuid, block, model.blocks);
						},
						maybeNext));
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{blocks: updatedBlocks}),
					elm$core$Platform$Cmd$none);
			case 'MoveBlockUp':
				var block = msg.a;
				var maybePrevious = A2(author$project$DictList$previous, block.uuid, model.blocks);
				var updatedBlocks = A2(
					elm$core$Maybe$withDefault,
					model.blocks,
					A2(
						elm$core$Maybe$map,
						function (previous) {
							return A4(author$project$DictList$insertBefore, previous.a, block.uuid, block, model.blocks);
						},
						maybePrevious));
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{blocks: updatedBlocks}),
					elm$core$Platform$Cmd$none);
			case 'NoOp':
				return _Utils_Tuple2(model, elm$core$Platform$Cmd$none);
			case 'SetBlockContextualMenu':
				var uuid = msg.a;
				var uiState = model.uiState;
				var newUiState = _Utils_update(
					uiState,
					{
						blockContextualMenu: elm$core$Maybe$Just(uuid)
					});
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{uiState: newUiState}),
					elm$core$Platform$Cmd$none);
			case 'SetCurrentDate':
				var date = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{currentDate: date}),
					elm$core$Platform$Cmd$none);
			case 'SetMultipleSelect':
				var _boolean = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{multipleSelect: _boolean}),
					elm$core$Platform$Cmd$none);
			case 'SetTagForColor':
				var color = msg.a;
				var label = msg.b;
				var sirColor = author$project$SIRColorPicker$fromColor(color);
				var newTags = ((!_Utils_eq(sirColor, elm$core$Maybe$Nothing)) ? elm$core$List$cons(
					{
						color: A2(elm$core$Maybe$withDefault, author$project$SIRColorPicker$Black, sirColor),
						label: label
					}) : elm$core$List$map(elm$core$Basics$identity))(
					A2(
						elm$core$List$filter,
						A2(
							elm$core$Basics$composeL,
							A2(
								elm$core$Basics$composeL,
								elm$core$Basics$neq(color),
								author$project$SIRColorPicker$getColor),
							function ($) {
								return $.color;
							}),
						model.tags));
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{tags: newTags}),
					elm$core$Platform$Cmd$none);
			case 'SetValueForCustomProperty':
				var property = msg.a;
				var block = msg.b;
				var value = msg.c;
				var updatedProperty = _Utils_update(
					property,
					{
						values: (elm$core$String$length(value) > 0) ? A3(elm$core$Dict$insert, block.uuid, value, property.values) : A2(elm$core$Dict$remove, block.uuid, property.values)
					});
				var replaceProperty = function (customProperty) {
					return _Utils_eq(property, customProperty) ? updatedProperty : customProperty;
				};
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							customProperties: A2(elm$core$List$map, replaceProperty, model.customProperties)
						}),
					elm$core$Platform$Cmd$none);
			case 'SyncBlockInputs':
				var block = msg.a;
				var syncedSize = {
					height: author$project$StringValueInput$syncFloatInput(block.size.height),
					length: author$project$StringValueInput$syncFloatInput(block.size.length),
					width: author$project$StringValueInput$syncFloatInput(block.size.width)
				};
				var syncedPosition = {
					x: author$project$StringValueInput$syncFloatInput(block.position.x),
					y: author$project$StringValueInput$syncFloatInput(block.position.y),
					z: author$project$StringValueInput$syncFloatInput(block.position.z)
				};
				var syncedMass = author$project$StringValueInput$syncFloatInput(block.mass);
				var syncedDensity = author$project$StringValueInput$syncFloatInput(block.density);
				var syncedCenterOfGravity = {
					x: author$project$StringValueInput$syncFloatInput(block.centerOfGravity.x),
					y: author$project$StringValueInput$syncFloatInput(block.centerOfGravity.y),
					z: author$project$StringValueInput$syncFloatInput(block.centerOfGravity.z)
				};
				var syncedBlock = _Utils_update(
					block,
					{centerOfGravity: syncedCenterOfGravity, density: syncedDensity, mass: syncedMass, position: syncedPosition, size: syncedSize});
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							blocks: A2(author$project$Main$updateBlockInBlocks, syncedBlock, model.blocks)
						}),
					elm$core$Platform$Cmd$none);
			case 'SyncPartitions':
				var syncedDecks = {
					number: author$project$StringValueInput$syncIntInput(model.partitions.decks.number),
					spacing: author$project$StringValueInput$syncFloatInput(model.partitions.decks.spacing),
					spacingExceptions: A2(
						elm$core$Dict$filter,
						F2(
							function (_n5, input) {
								return !_Utils_eq(input.value, model.partitions.decks.spacing.value);
							}),
						A2(
							elm$core$Dict$map,
							F2(
								function (_n4, input) {
									return author$project$StringValueInput$syncFloatInput(input);
								}),
							model.partitions.decks.spacingExceptions)),
					zero: {
						index: model.partitions.decks.zero.index,
						position: author$project$StringValueInput$syncFloatInput(model.partitions.decks.zero.position)
					}
				};
				var syncedBulkheads = {
					number: author$project$StringValueInput$syncIntInput(model.partitions.bulkheads.number),
					spacing: author$project$StringValueInput$syncFloatInput(model.partitions.bulkheads.spacing),
					spacingExceptions: A2(
						elm$core$Dict$filter,
						F2(
							function (_n3, input) {
								return !_Utils_eq(input.value, model.partitions.bulkheads.spacing.value);
							}),
						A2(
							elm$core$Dict$map,
							F2(
								function (_n2, input) {
									return author$project$StringValueInput$syncFloatInput(input);
								}),
							model.partitions.bulkheads.spacingExceptions)),
					zero: {
						index: model.partitions.bulkheads.zero.index,
						position: author$project$StringValueInput$syncFloatInput(model.partitions.bulkheads.zero.position)
					}
				};
				var updatedModel = A2(
					author$project$Main$asPartitionsInModel,
					model,
					A3(
						author$project$Main$flip,
						author$project$Main$asBulkheadsInPartitions,
						syncedBulkheads,
						A2(author$project$Main$asDecksInPartitions, model.partitions, syncedDecks)));
				return _Utils_Tuple2(updatedModel, elm$core$Platform$Cmd$none);
			case 'RenameBlock':
				var blockToRename = msg.a;
				var newLabel = msg.b;
				return _Utils_Tuple2(
					A2(
						author$project$Main$updateBlockInModel,
						A2(author$project$Main$renameBlock, newLabel, blockToRename),
						model),
					elm$core$Platform$Cmd$none);
			case 'RenameHull':
				var hullReference = msg.a;
				var newLabel = msg.b;
				var updatedModel = function () {
					var _n7 = A2(elm$core$Dict$get, hullReference, model.slices);
					if (_n7.$ === 'Just') {
						var hullSlicesForRef = _n7.a;
						return (!A2(elm$core$Dict$member, newLabel, model.slices)) ? _Utils_update(
							model,
							{
								selectedHullReference: elm$core$Maybe$Just(newLabel),
								slices: A3(
									elm$core$Dict$insert,
									newLabel,
									hullSlicesForRef,
									A2(elm$core$Dict$remove, hullReference, model.slices))
							}) : model;
					} else {
						return model;
					}
				}();
				var refToFocus = (!A2(elm$core$Dict$member, newLabel, model.slices)) ? newLabel : hullReference;
				return _Utils_Tuple2(
					updatedModel,
					elm$core$Platform$Cmd$batch(
						_List_fromArray(
							[
								A2(
								elm$core$Task$attempt,
								function (_n6) {
									return author$project$Main$NoJs(author$project$Main$NoOp);
								},
								elm$browser$Browser$Dom$focus(refToFocus))
							])));
			case 'SaveNewHullName':
				var name = msg.a;
				var uiState = model.uiState;
				var newUiState = _Utils_update(
					uiState,
					{
						newHullName: elm$core$Maybe$Just(name)
					});
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{uiState: newUiState}),
					elm$core$Platform$Cmd$none);
			case 'SaveAsNewHull':
				var hullReference = msg.a;
				var newLabel = A2(author$project$Main$renameKey, model, hullReference);
				var updatedModel = function () {
					var _n9 = A2(elm$core$Dict$get, hullReference, model.slices);
					if (_n9.$ === 'Just') {
						var hullSlicesForRef = _n9.a;
						return (!A2(elm$core$Dict$member, newLabel, model.slices)) ? _Utils_update(
							model,
							{
								selectedHullReference: elm$core$Maybe$Just(newLabel),
								slices: A4(
									author$project$Main$insertIfUnique,
									newLabel,
									author$project$HullSlices$applyCustomPropertiesToHullSlices(hullSlicesForRef),
									model.slices,
									model.slices)
							}) : model;
					} else {
						return model;
					}
				}();
				return _Utils_Tuple2(
					updatedModel,
					elm$core$Platform$Cmd$batch(
						_List_fromArray(
							[
								A2(
								elm$core$Task$attempt,
								function (_n8) {
									return author$project$Main$NoJs(author$project$Main$NoOp);
								},
								elm$browser$Browser$Dom$focus(newLabel))
							])));
			case 'CancelReadClipboard':
				var olduiState = model.uiState;
				var updateUiState = function (isWaiting) {
					return _Utils_update(
						olduiState,
						{waitToPasteClipBoard: isWaiting});
				};
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							uiState: updateUiState(false)
						}),
					elm$core$Platform$Cmd$none);
			case 'ToggleAccordion':
				var isOpen = msg.a;
				var accordionId = msg.b;
				var uiState = model.uiState;
				var newUiState = _Utils_update(
					uiState,
					{
						accordions: A3(elm$core$Dict$insert, accordionId, isOpen, uiState.accordions)
					});
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{uiState: newUiState}),
					elm$core$Platform$Cmd$none);
			case 'UpdateCenterOfGravity':
				var axis = msg.a;
				var block = msg.b;
				var input = msg.c;
				var position = block.centerOfGravity;
				var axisFloatInput = A2(author$project$Main$axisAccessor, axis, position);
				var updatedBlock = _Utils_update(
					block,
					{
						centerOfGravity: A3(
							author$project$Main$asAxisInPosition,
							axis,
							position,
							function () {
								var _n10 = elm$core$String$toFloat(input);
								if (_n10.$ === 'Just') {
									var value = _n10.a;
									return A3(
										author$project$Main$flip,
										author$project$StringValueInput$asStringIn,
										input,
										A2(author$project$StringValueInput$asValueIn, axisFloatInput, value));
								} else {
									return A2(author$project$StringValueInput$asStringIn, axisFloatInput, input);
								}
							}())
					});
				var updatedBlockFixed = _Utils_update(
					updatedBlock,
					{centerOfGravityFixed: true});
				return _Utils_Tuple2(
					A2(author$project$Main$updateBlockInModel, updatedBlockFixed, model),
					elm$core$Platform$Cmd$none);
			case 'UpdateCustomPropertyLabel':
				var property = msg.a;
				var newLabel = msg.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							customProperties: A2(
								elm$core$List$map,
								function (p) {
									return _Utils_eq(p, property) ? _Utils_update(
										p,
										{label: newLabel}) : p;
								},
								model.customProperties)
						}),
					elm$core$Platform$Cmd$none);
			case 'UpdateMass':
				var block = msg.a;
				var input = msg.b;
				var updatedBlock = author$project$Main$updateBlockMassAndDensity(
					_Utils_update(
						block,
						{
							mass: A2(author$project$StringValueInput$setString, input, block.mass),
							referenceForMass: author$project$Main$Mass
						}));
				var updatedModel = _Utils_update(
					model,
					{
						blocks: A2(author$project$Main$updateBlockInBlocks, updatedBlock, model.blocks)
					});
				return _Utils_Tuple2(updatedModel, elm$core$Platform$Cmd$none);
			case 'UpdateDensity':
				var block = msg.a;
				var input = msg.b;
				var updatedBlock = author$project$Main$updateBlockMassAndDensity(
					_Utils_update(
						block,
						{
							density: A2(
								author$project$StringValueInput$setString,
								A2(
									elm$core$String$filter,
									elm$core$Basics$neq(
										_Utils_chr('-')),
									input),
								block.density),
							referenceForMass: author$project$Main$Density
						}));
				var updatedModel = _Utils_update(
					model,
					{
						blocks: A2(author$project$Main$updateBlockInBlocks, updatedBlock, model.blocks)
					});
				return _Utils_Tuple2(updatedModel, elm$core$Platform$Cmd$none);
			default:
				var uiState = model.uiState;
				var newUiState = _Utils_update(
					uiState,
					{blockContextualMenu: elm$core$Maybe$Nothing});
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{uiState: newUiState}),
					elm$core$Platform$Cmd$none);
		}
	});
var author$project$Main$update = F2(
	function (msg, model) {
		return author$project$Main$updateCentreOfGravity(
			function () {
				switch (msg.$) {
					case 'FromJs':
						var fromJsMsg = msg.a;
						return A2(author$project$Main$updateFromJs, fromJsMsg, model);
					case 'NoJs':
						var noJsMsg = msg.a;
						return A2(author$project$Main$updateNoJs, noJsMsg, model);
					default:
						var toJsMsg = msg.a;
						return A2(author$project$Main$updateToJs, toJsMsg, model);
				}
			}());
	});
var elm$html$Html$p = _VirtualDom_node('p');
var elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var elm$html$Html$text = elm$virtual_dom$VirtualDom$text;
var elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			elm$json$Json$Encode$string(string));
	});
var elm$html$Html$Attributes$class = elm$html$Html$Attributes$stringProperty('className');
var author$project$Main$viewCopyright = A2(
	elm$html$Html$p,
	_List_fromArray(
		[
			elm$html$Html$Attributes$class('copyright-info')
		]),
	_List_fromArray(
		[
			elm$html$Html$text('(c) Naval Group / Sirehna 2019 All rights reserved')
		]));
var elm$html$Html$div = _VirtualDom_node('div');
var elm$html$Html$input = _VirtualDom_node('input');
var elm$html$Html$label = _VirtualDom_node('label');
var elm$html$Html$Attributes$accept = elm$html$Html$Attributes$stringProperty('accept');
var elm$html$Html$Attributes$for = elm$html$Html$Attributes$stringProperty('htmlFor');
var elm$html$Html$Attributes$id = elm$html$Html$Attributes$stringProperty('id');
var elm$html$Html$Attributes$name = elm$html$Html$Attributes$stringProperty('name');
var elm$html$Html$Attributes$title = elm$html$Html$Attributes$stringProperty('title');
var elm$html$Html$Attributes$type_ = elm$html$Html$Attributes$stringProperty('type');
var elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 'Normal', a: a};
};
var elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			elm$virtual_dom$VirtualDom$on,
			event,
			elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var author$project$HullReferences$viewHullImporter = function (openLibraryMsg) {
	return A2(
		elm$html$Html$div,
		_List_fromArray(
			[
				elm$html$Html$Attributes$class('import-item'),
				elm$html$Html$Attributes$title('Import hull library from file')
			]),
		_List_fromArray(
			[
				A2(
				elm$html$Html$label,
				_List_fromArray(
					[
						elm$html$Html$Attributes$for('import-hull-library')
					]),
				_List_fromArray(
					[
						elm$html$Html$text('Import')
					])),
				A2(
				elm$html$Html$input,
				_List_fromArray(
					[
						elm$html$Html$Attributes$type_('file'),
						elm$html$Html$Attributes$accept('application/json, .json'),
						elm$html$Html$Attributes$id('import-hull-library'),
						elm$html$Html$Attributes$name('import-hull-library'),
						elm$html$Html$Attributes$class('hidden-input'),
						A2(
						elm$html$Html$Events$on,
						'change',
						elm$json$Json$Decode$succeed(openLibraryMsg))
					]),
				_List_Nil)
			]));
};
var elm$html$Html$Events$onClick = function (msg) {
	return A2(
		elm$html$Html$Events$on,
		'click',
		elm$json$Json$Decode$succeed(msg));
};
var lattyware$elm_fontawesome$FontAwesome$Icon$Icon = F5(
	function (prefix, name, _class, viewBox, path) {
		return {_class: _class, name: name, path: path, prefix: prefix, viewBox: viewBox};
	});
var elm$virtual_dom$VirtualDom$attribute = F2(
	function (key, value) {
		return A2(
			_VirtualDom_attribute,
			_VirtualDom_noOnOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var elm$html$Html$Attributes$attribute = elm$virtual_dom$VirtualDom$attribute;
var elm$svg$Svg$trustedNode = _VirtualDom_nodeNS('http://www.w3.org/2000/svg');
var elm$svg$Svg$path = elm$svg$Svg$trustedNode('path');
var elm$svg$Svg$svg = elm$svg$Svg$trustedNode('svg');
var elm$svg$Svg$Attributes$class = _VirtualDom_attribute('class');
var elm$svg$Svg$Attributes$d = _VirtualDom_attribute('d');
var elm$svg$Svg$Attributes$fill = _VirtualDom_attribute('fill');
var elm$svg$Svg$Attributes$viewBox = _VirtualDom_attribute('viewBox');
var lattyware$elm_fontawesome$FontAwesome$Icon$view = F2(
	function (icon, attrs) {
		return A2(
			elm$svg$Svg$svg,
			_Utils_ap(
				_List_fromArray(
					[
						A2(elm$html$Html$Attributes$attribute, 'data-prefix', icon.prefix),
						A2(elm$html$Html$Attributes$attribute, 'data-icon', icon.name),
						elm$svg$Svg$Attributes$class(icon._class),
						A2(elm$html$Html$Attributes$attribute, 'role', 'img'),
						A2(elm$html$Html$Attributes$attribute, 'xmlns', 'http://www.w3.org/2000/svg'),
						elm$svg$Svg$Attributes$viewBox(icon.viewBox)
					]),
				attrs),
			_List_fromArray(
				[
					A2(
					elm$svg$Svg$path,
					_List_fromArray(
						[
							elm$svg$Svg$Attributes$fill('currentColor'),
							elm$svg$Svg$Attributes$d(icon.path)
						]),
					_List_Nil)
				]));
	});
var lattyware$elm_fontawesome$FontAwesome$Solid$arrowRight = lattyware$elm_fontawesome$FontAwesome$Icon$view(
	A5(lattyware$elm_fontawesome$FontAwesome$Icon$Icon, 'fas', 'arrow-right', 'svg-inline--fa fa-arrow-right fa-w-14', '0 0 448 512', 'M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z'));
var author$project$HullReferences$viewFocusHullAction = F2(
	function (ref, changeViewMsg) {
		return A2(
			elm$html$Html$div,
			_List_fromArray(
				[
					elm$html$Html$Attributes$class('hull-action focus-hull'),
					elm$html$Html$Events$onClick(changeViewMsg),
					elm$html$Html$Attributes$title('Focus hull')
				]),
			_List_fromArray(
				[
					lattyware$elm_fontawesome$FontAwesome$Solid$arrowRight(_List_Nil)
				]));
	});
var lattyware$elm_fontawesome$FontAwesome$Solid$trash = lattyware$elm_fontawesome$FontAwesome$Icon$view(
	A5(lattyware$elm_fontawesome$FontAwesome$Icon$Icon, 'fas', 'trash', 'svg-inline--fa fa-trash fa-w-14', '0 0 448 512', 'M0 84V56c0-13.3 10.7-24 24-24h112l9.4-18.7c4-8.2 12.3-13.3 21.4-13.3h114.3c9.1 0 17.4 5.1 21.5 13.3L312 32h112c13.3 0 24 10.7 24 24v28c0 6.6-5.4 12-12 12H12C5.4 96 0 90.6 0 84zm415.2 56.7L394.8 467c-1.6 25.3-22.6 45-47.9 45H101.1c-25.3 0-46.3-19.7-47.9-45L32.8 140.7c-.4-6.9 5.1-12.7 12-12.7h358.5c6.8 0 12.3 5.8 11.9 12.7z'));
var author$project$HullReferences$viewRemoveHullAction = F2(
	function (hullReference, removeHullMsg) {
		return A2(
			elm$html$Html$div,
			_List_fromArray(
				[
					elm$html$Html$Attributes$class('hull-action delete-hull'),
					elm$html$Html$Events$onClick(
					removeHullMsg(hullReference)),
					elm$html$Html$Attributes$title('Delete hull from library')
				]),
			_List_fromArray(
				[
					lattyware$elm_fontawesome$FontAwesome$Solid$trash(_List_Nil)
				]));
	});
var lattyware$elm_fontawesome$FontAwesome$Solid$save = lattyware$elm_fontawesome$FontAwesome$Icon$view(
	A5(lattyware$elm_fontawesome$FontAwesome$Icon$Icon, 'fas', 'save', 'svg-inline--fa fa-save fa-w-14', '0 0 448 512', 'M433.941 129.941l-83.882-83.882A48 48 0 0 0 316.118 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V163.882a48 48 0 0 0-14.059-33.941zM224 416c-35.346 0-64-28.654-64-64 0-35.346 28.654-64 64-64s64 28.654 64 64c0 35.346-28.654 64-64 64zm96-304.52V212c0 6.627-5.373 12-12 12H76c-6.627 0-12-5.373-12-12V108c0-6.627 5.373-12 12-12h228.52c3.183 0 6.235 1.264 8.485 3.515l3.48 3.48A11.996 11.996 0 0 1 320 111.48z'));
var author$project$HullReferences$viewSaveAsNewHullAction = F2(
	function (hullReference, saveAsNewMsg) {
		return A2(
			elm$html$Html$div,
			_List_fromArray(
				[
					elm$html$Html$Attributes$class('hull-action save-hull'),
					elm$html$Html$Events$onClick(
					saveAsNewMsg(hullReference)),
					elm$html$Html$Attributes$title('Save as a new')
				]),
			_List_fromArray(
				[
					lattyware$elm_fontawesome$FontAwesome$Solid$save(_List_Nil)
				]));
	});
var elm$html$Html$li = _VirtualDom_node('li');
var elm$html$Html$Attributes$value = elm$html$Html$Attributes$stringProperty('value');
var elm$html$Html$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 'MayStopPropagation', a: a};
};
var elm$html$Html$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			elm$virtual_dom$VirtualDom$on,
			event,
			elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3(elm$core$List$foldr, elm$json$Json$Decode$field, decoder, fields);
	});
var elm$html$Html$Events$targetValue = A2(
	elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	elm$json$Json$Decode$string);
var elm$html$Html$Events$onInput = function (tagger) {
	return A2(
		elm$html$Html$Events$stopPropagationOn,
		'input',
		A2(
			elm$json$Json$Decode$map,
			elm$html$Html$Events$alwaysStop,
			A2(elm$json$Json$Decode$map, tagger, elm$html$Html$Events$targetValue)));
};
var lattyware$elm_fontawesome$FontAwesome$Solid$asterisk = lattyware$elm_fontawesome$FontAwesome$Icon$view(
	A5(lattyware$elm_fontawesome$FontAwesome$Icon$Icon, 'fas', 'asterisk', 'svg-inline--fa fa-asterisk fa-w-16', '0 0 512 512', 'M478.21 334.093L336 256l142.21-78.093c11.795-6.477 15.961-21.384 9.232-33.037l-19.48-33.741c-6.728-11.653-21.72-15.499-33.227-8.523L296 186.718l3.475-162.204C299.763 11.061 288.937 0 275.48 0h-38.96c-13.456 0-24.283 11.061-23.994 24.514L216 186.718 77.265 102.607c-11.506-6.976-26.499-3.13-33.227 8.523l-19.48 33.741c-6.728 11.653-2.562 26.56 9.233 33.037L176 256 33.79 334.093c-11.795 6.477-15.961 21.384-9.232 33.037l19.48 33.741c6.728 11.653 21.721 15.499 33.227 8.523L216 325.282l-3.475 162.204C212.237 500.939 223.064 512 236.52 512h38.961c13.456 0 24.283-11.061 23.995-24.514L296 325.282l138.735 84.111c11.506 6.976 26.499 3.13 33.227-8.523l19.48-33.741c6.728-11.653 2.563-26.559-9.232-33.036z'));
var author$project$HullReferences$viewHullReference = F5(
	function (selectedHull, hullReferencesMsgs, ref, hash, isHullCustomized) {
		var hullWrapperClass = isHullCustomized ? 'hull-info-wrapper hull-info-wrapper__custom' : 'hull-info-wrapper hull-info-wrapper__uncustom';
		return A2(
			elm$html$Html$li,
			_Utils_eq(
				selectedHull,
				elm$core$Maybe$Just(ref)) ? _List_fromArray(
				[
					elm$html$Html$Attributes$class('hull-reference hull-reference__selected')
				]) : _List_fromArray(
				[
					elm$html$Html$Attributes$class('hull-reference'),
					elm$html$Html$Events$onClick(
					hullReferencesMsgs.selectHullMsg(ref))
				]),
			_List_fromArray(
				[
					A2(
					elm$html$Html$div,
					_List_fromArray(
						[
							elm$html$Html$Attributes$class(hullWrapperClass)
						]),
					_List_fromArray(
						[
							A2(
							elm$html$Html$input,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('hull-label'),
									elm$html$Html$Attributes$id(ref),
									elm$html$Html$Attributes$value(ref),
									elm$html$Html$Events$onInput(
									hullReferencesMsgs.renameHullMsg(ref))
								]),
							_List_Nil),
							A2(
							elm$html$Html$p,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('hull-hash')
								]),
							_List_fromArray(
								[
									elm$html$Html$text(hash)
								]))
						])),
					isHullCustomized ? A2(
					elm$html$Html$div,
					_List_fromArray(
						[
							elm$html$Html$Attributes$class('hull-customized')
						]),
					_List_fromArray(
						[
							A2(
							elm$html$Html$div,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('hull-actions hull-actions__custom')
								]),
							_List_fromArray(
								[
									A2(author$project$HullReferences$viewSaveAsNewHullAction, ref, hullReferencesMsgs.saveAsNewMsg),
									A2(author$project$HullReferences$viewRemoveHullAction, ref, hullReferencesMsgs.removeHullMsg),
									A2(author$project$HullReferences$viewFocusHullAction, ref, hullReferencesMsgs.changeViewMsg)
								])),
							A2(
							elm$html$Html$div,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('hull-custom-icon')
								]),
							_List_fromArray(
								[
									elm$html$Html$text('unsaved'),
									lattyware$elm_fontawesome$FontAwesome$Solid$asterisk(_List_Nil),
									elm$html$Html$text('changes')
								]))
						])) : A2(
					elm$html$Html$div,
					_List_fromArray(
						[
							elm$html$Html$Attributes$class('hull-actions hull-actions__uncustom')
						]),
					_List_fromArray(
						[
							A2(author$project$HullReferences$viewRemoveHullAction, ref, hullReferencesMsgs.removeHullMsg),
							A2(author$project$HullReferences$viewFocusHullAction, ref, hullReferencesMsgs.changeViewMsg)
						]))
				]));
	});
var author$project$HullReferences$viewCreateHullAction = function (createHullMsg) {
	return A2(
		elm$html$Html$div,
		_List_fromArray(
			[
				elm$html$Html$Attributes$class('hull-action create-hull'),
				elm$html$Html$Events$onClick(createHullMsg),
				elm$html$Html$Attributes$title('Create a new empty hull')
			]),
		_List_fromArray(
			[
				lattyware$elm_fontawesome$FontAwesome$Solid$save(_List_Nil)
			]));
};
var elm$html$Html$Attributes$placeholder = elm$html$Html$Attributes$stringProperty('placeholder');
var author$project$HullReferences$viewNewHullReference = F3(
	function (newHullName, saveNewHullNameMsg, createHullMsg) {
		return A2(
			elm$html$Html$li,
			_List_fromArray(
				[
					elm$html$Html$Attributes$class('hull-reference hull-reference-add')
				]),
			_List_fromArray(
				[
					A2(elm$html$Html$div, _List_Nil, _List_Nil),
					A2(
					elm$html$Html$div,
					_List_fromArray(
						[
							elm$html$Html$Attributes$class('hull-info-wrapper hull-info-wrapper__add')
						]),
					_List_fromArray(
						[
							A2(
							elm$html$Html$input,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('hull-label-add'),
									elm$html$Html$Attributes$type_('text'),
									elm$html$Html$Attributes$placeholder('New Hull'),
									elm$html$Html$Attributes$value(
									A2(elm$core$Maybe$withDefault, '', newHullName)),
									elm$html$Html$Events$onInput(saveNewHullNameMsg)
								]),
							_List_Nil),
							A2(
							elm$html$Html$p,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('hull-path')
								]),
							_List_fromArray(
								[
									elm$html$Html$text('Add a new hull')
								]))
						])),
					A2(
					elm$html$Html$div,
					_List_fromArray(
						[
							elm$html$Html$Attributes$class('hull-actions hull-actions__add')
						]),
					_List_fromArray(
						[
							author$project$HullReferences$viewCreateHullAction(createHullMsg)
						]))
				]));
	});
var author$project$HullReferences$viewUnselectHullReference = F2(
	function (isAHullSelected, unselectHullMsg) {
		return A2(
			elm$html$Html$li,
			isAHullSelected ? _List_fromArray(
				[
					elm$html$Html$Attributes$class('hull-reference'),
					elm$html$Html$Events$onClick(unselectHullMsg)
				]) : _List_fromArray(
				[
					elm$html$Html$Attributes$class('hull-reference hull-reference-none hull-reference__selected')
				]),
			_List_fromArray(
				[
					A2(
					elm$html$Html$div,
					_List_fromArray(
						[
							elm$html$Html$Attributes$class('hull-info-wrapper')
						]),
					_List_fromArray(
						[
							A2(
							elm$html$Html$p,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('hull-label')
								]),
							_List_fromArray(
								[
									elm$html$Html$text('None')
								])),
							A2(
							elm$html$Html$p,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('hull-path')
								]),
							_List_fromArray(
								[
									elm$html$Html$text('No hull is displayed or used in computations')
								]))
						]))
				]));
	});
var elm$core$List$map3 = _List_map3;
var elm$html$Html$ul = _VirtualDom_node('ul');
var author$project$HullReferences$viewHullReferences = F6(
	function (hullRefs, hullHashs, isHullsCustomized, selectedHull, newHullName, hullReferencesMsgs) {
		var isAHullSelected = !_Utils_eq(selectedHull, elm$core$Maybe$Nothing);
		return A2(
			elm$html$Html$ul,
			_List_fromArray(
				[
					elm$html$Html$Attributes$class('hull-references')
				]),
			A2(
				elm$core$List$cons,
				A2(author$project$HullReferences$viewUnselectHullReference, isAHullSelected, hullReferencesMsgs.unselectHullMsg),
				A2(
					elm$core$List$cons,
					A3(author$project$HullReferences$viewNewHullReference, newHullName, hullReferencesMsgs.saveNewHullNameMsg, hullReferencesMsgs.createHullMsg),
					A4(
						elm$core$List$map3,
						A2(author$project$HullReferences$viewHullReference, selectedHull, hullReferencesMsgs),
						hullRefs,
						hullHashs,
						isHullsCustomized))));
	});
var elm$html$Html$h2 = _VirtualDom_node('h2');
var author$project$HullReferences$viewHullLibraryPanel = F6(
	function (hullRefs, hullHashs, isHullsCustomized, selectedHull, newHullName, hullReferencesMsgs) {
		return A2(
			elm$html$Html$div,
			_List_fromArray(
				[
					elm$html$Html$Attributes$class('panel hull-panel')
				]),
			_List_fromArray(
				[
					A2(
					elm$html$Html$h2,
					_List_fromArray(
						[
							elm$html$Html$Attributes$class('hull-panel-title')
						]),
					_List_fromArray(
						[
							elm$html$Html$text('Hull Library'),
							A2(
							elm$html$Html$div,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('hull-library-actions')
								]),
							_List_fromArray(
								[
									author$project$HullReferences$viewHullImporter(hullReferencesMsgs.openLibraryMsg)
								]))
						])),
					A6(author$project$HullReferences$viewHullReferences, hullRefs, hullHashs, isHullsCustomized, selectedHull, newHullName, hullReferencesMsgs)
				]));
	});
var author$project$HullSlices$isHullCustomized = function (hullSlices) {
	return (_Utils_eq(elm$core$Maybe$Nothing, hullSlices.custom.length) && (_Utils_eq(elm$core$Maybe$Nothing, hullSlices.custom.breadth) && (_Utils_eq(elm$core$Maybe$Nothing, hullSlices.custom.depth) && (_Utils_eq(elm$core$Maybe$Nothing, hullSlices.custom.draught) && _Utils_eq(elm$core$Maybe$Nothing, hullSlices.custom.hullslicesPositions))))) ? false : true;
};
var author$project$Main$CreateHull = {$: 'CreateHull'};
var author$project$Main$HullDetails = {$: 'HullDetails'};
var author$project$Main$OpenHullsLibrary = {$: 'OpenHullsLibrary'};
var author$project$Main$RemoveHull = function (a) {
	return {$: 'RemoveHull', a: a};
};
var author$project$Main$RenameHull = F2(
	function (a, b) {
		return {$: 'RenameHull', a: a, b: b};
	});
var author$project$Main$SaveAsNewHull = function (a) {
	return {$: 'SaveAsNewHull', a: a};
};
var author$project$Main$SaveNewHullName = function (a) {
	return {$: 'SaveNewHullName', a: a};
};
var author$project$Main$SelectHullReference = function (a) {
	return {$: 'SelectHullReference', a: a};
};
var author$project$Main$SwitchViewMode = function (a) {
	return {$: 'SwitchViewMode', a: a};
};
var author$project$Main$ToJs = function (a) {
	return {$: 'ToJs', a: a};
};
var author$project$Main$UnselectHullReference = {$: 'UnselectHullReference'};
var author$project$Main$hullReferencesMsgs = {
	changeViewMsg: author$project$Main$ToJs(
		author$project$Main$SwitchViewMode(
			author$project$Main$Hull(author$project$Main$HullDetails))),
	createHullMsg: author$project$Main$ToJs(author$project$Main$CreateHull),
	openLibraryMsg: author$project$Main$ToJs(author$project$Main$OpenHullsLibrary),
	removeHullMsg: A2(elm$core$Basics$composeL, author$project$Main$ToJs, author$project$Main$RemoveHull),
	renameHullMsg: F2(
		function (s1, s2) {
			return author$project$Main$NoJs(
				A2(author$project$Main$RenameHull, s1, s2));
		}),
	saveAsNewMsg: A2(elm$core$Basics$composeL, author$project$Main$NoJs, author$project$Main$SaveAsNewHull),
	saveNewHullNameMsg: A2(elm$core$Basics$composeL, author$project$Main$NoJs, author$project$Main$SaveNewHullName),
	selectHullMsg: A2(elm$core$Basics$composeL, author$project$Main$ToJs, author$project$Main$SelectHullReference),
	unselectHullMsg: author$project$Main$ToJs(author$project$Main$UnselectHullReference)
};
var author$project$Main$viewHullLibraryPanel = function (model) {
	return A6(
		author$project$HullReferences$viewHullLibraryPanel,
		elm$core$Dict$keys(model.slices),
		A2(
			elm$core$List$map,
			author$project$EncodersDecoders$getHashImageForSlices,
			elm$core$Dict$values(model.slices)),
		A2(
			elm$core$List$map,
			author$project$HullSlices$isHullCustomized,
			elm$core$Dict$values(model.slices)),
		model.selectedHullReference,
		model.uiState.newHullName,
		author$project$Main$hullReferencesMsgs);
};
var elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var elm$html$Html$Attributes$style = elm$virtual_dom$VirtualDom$style;
var terezka$line_charts$Internal$Line$Series = function (a) {
	return {$: 'Series', a: a};
};
var terezka$line_charts$Internal$Line$SeriesConfig = F5(
	function (color, shape, dashing, label, data) {
		return {color: color, dashing: dashing, data: data, label: label, shape: shape};
	});
var terezka$line_charts$Internal$Line$line = F4(
	function (color_, shape_, label_, data_) {
		return terezka$line_charts$Internal$Line$Series(
			A5(terezka$line_charts$Internal$Line$SeriesConfig, color_, shape_, _List_Nil, label_, data_));
	});
var terezka$line_charts$LineChart$line = terezka$line_charts$Internal$Line$line;
var elm$svg$Svg$defs = elm$svg$Svg$trustedNode('defs');
var elm$svg$Svg$g = elm$svg$Svg$trustedNode('g');
var terezka$line_charts$Internal$Axis$variable = function (_n0) {
	var config = _n0.a;
	return config.variable;
};
var elm$core$Basics$round = _Basics_round;
var avh4$elm_color$Color$toCssString = function (_n0) {
	var r = _n0.a;
	var g = _n0.b;
	var b = _n0.c;
	var a = _n0.d;
	var roundTo = function (x) {
		return elm$core$Basics$round(x * 1000) / 1000;
	};
	var pct = function (x) {
		return elm$core$Basics$round(x * 10000) / 100;
	};
	return elm$core$String$concat(
		_List_fromArray(
			[
				'rgba(',
				elm$core$String$fromFloat(
				pct(r)),
				'%,',
				elm$core$String$fromFloat(
				pct(g)),
				'%,',
				elm$core$String$fromFloat(
				pct(b)),
				'%,',
				elm$core$String$fromFloat(
				roundTo(a)),
				')'
			]));
};
var elm$svg$Svg$Attributes$stroke = _VirtualDom_attribute('stroke');
var elm$svg$Svg$Attributes$strokeWidth = _VirtualDom_attribute('stroke-width');
var elm$svg$Svg$Attributes$clipPath = _VirtualDom_attribute('clip-path');
var terezka$line_charts$Internal$Utils$toChartAreaId = function (id) {
	return 'chart__chart-area--' + id;
};
var terezka$line_charts$Internal$Svg$withinChartArea = function (_n0) {
	var id = _n0.id;
	return elm$svg$Svg$Attributes$clipPath(
		'url(#' + (terezka$line_charts$Internal$Utils$toChartAreaId(id) + ')'));
};
var terezka$line_charts$Internal$Axis$attributesLine = F2(
	function (system, _n0) {
		var events = _n0.events;
		var width = _n0.width;
		var color = _n0.color;
		return _Utils_ap(
			events,
			_List_fromArray(
				[
					elm$svg$Svg$Attributes$strokeWidth(
					elm$core$String$fromFloat(width)),
					elm$svg$Svg$Attributes$stroke(
					avh4$elm_color$Color$toCssString(color)),
					terezka$line_charts$Internal$Svg$withinChartArea(system)
				]));
	});
var elm$svg$Svg$Attributes$style = _VirtualDom_attribute('style');
var terezka$line_charts$Internal$Path$Line = function (a) {
	return {$: 'Line', a: a};
};
var terezka$line_charts$Internal$Path$Move = function (a) {
	return {$: 'Move', a: a};
};
var terezka$line_charts$Internal$Path$join = function (commands) {
	return A2(elm$core$String$join, ' ', commands);
};
var terezka$line_charts$Internal$Path$bool = function (bool_) {
	return bool_ ? '1' : '0';
};
var terezka$line_charts$Internal$Path$point = function (point_) {
	return elm$core$String$fromFloat(point_.x) + (' ' + elm$core$String$fromFloat(point_.y));
};
var terezka$line_charts$Internal$Path$points = function (points_) {
	return A2(
		elm$core$String$join,
		',',
		A2(elm$core$List$map, terezka$line_charts$Internal$Path$point, points_));
};
var terezka$line_charts$Internal$Path$toString = function (command) {
	switch (command.$) {
		case 'Close':
			return 'Z';
		case 'Move':
			var p = command.a;
			return 'M' + terezka$line_charts$Internal$Path$point(p);
		case 'Line':
			var p = command.a;
			return 'L' + terezka$line_charts$Internal$Path$point(p);
		case 'Horizontal':
			var x = command.a;
			return 'H' + elm$core$String$fromFloat(x);
		case 'Vertical':
			var y = command.a;
			return 'V' + elm$core$String$fromFloat(y);
		case 'CubicBeziers':
			var c1 = command.a;
			var c2 = command.b;
			var p = command.c;
			return 'C' + terezka$line_charts$Internal$Path$points(
				_List_fromArray(
					[c1, c2, p]));
		case 'CubicBeziersShort':
			var c1 = command.a;
			var p = command.b;
			return 'Q' + terezka$line_charts$Internal$Path$points(
				_List_fromArray(
					[c1, p]));
		case 'QuadraticBeziers':
			var c1 = command.a;
			var p = command.b;
			return 'Q' + terezka$line_charts$Internal$Path$points(
				_List_fromArray(
					[c1, p]));
		case 'QuadraticBeziersShort':
			var p = command.a;
			return 'T' + terezka$line_charts$Internal$Path$point(p);
		default:
			var rx = command.a;
			var ry = command.b;
			var xAxisRotation = command.c;
			var largeArcFlag = command.d;
			var sweepFlag = command.e;
			var p = command.f;
			return 'A' + terezka$line_charts$Internal$Path$join(
				_List_fromArray(
					[
						elm$core$String$fromFloat(rx),
						elm$core$String$fromFloat(ry),
						elm$core$String$fromInt(xAxisRotation),
						terezka$line_charts$Internal$Path$bool(largeArcFlag),
						terezka$line_charts$Internal$Path$bool(sweepFlag),
						terezka$line_charts$Internal$Path$point(p)
					]));
	}
};
var terezka$line_charts$Internal$Path$Arc = F6(
	function (a, b, c, d, e, f) {
		return {$: 'Arc', a: a, b: b, c: c, d: d, e: e, f: f};
	});
var terezka$line_charts$Internal$Path$Close = {$: 'Close'};
var terezka$line_charts$Internal$Path$CubicBeziers = F3(
	function (a, b, c) {
		return {$: 'CubicBeziers', a: a, b: b, c: c};
	});
var terezka$line_charts$Internal$Path$CubicBeziersShort = F2(
	function (a, b) {
		return {$: 'CubicBeziersShort', a: a, b: b};
	});
var terezka$line_charts$Internal$Path$Horizontal = function (a) {
	return {$: 'Horizontal', a: a};
};
var terezka$line_charts$Internal$Path$QuadraticBeziers = F2(
	function (a, b) {
		return {$: 'QuadraticBeziers', a: a, b: b};
	});
var terezka$line_charts$Internal$Path$QuadraticBeziersShort = function (a) {
	return {$: 'QuadraticBeziersShort', a: a};
};
var terezka$line_charts$Internal$Path$Vertical = function (a) {
	return {$: 'Vertical', a: a};
};
var terezka$line_charts$Internal$Coordinate$lengthX = function (system) {
	return A2(elm$core$Basics$max, 1, (system.frame.size.width - system.frame.margin.left) - system.frame.margin.right);
};
var terezka$line_charts$Internal$Coordinate$reachX = function (system) {
	var diff = system.x.max - system.x.min;
	return (diff > 0) ? diff : 1;
};
var terezka$line_charts$LineChart$Coordinate$scaleSvgX = F2(
	function (system, value) {
		return (value * terezka$line_charts$Internal$Coordinate$lengthX(system)) / terezka$line_charts$Internal$Coordinate$reachX(system);
	});
var terezka$line_charts$LineChart$Coordinate$toSvgX = F2(
	function (system, value) {
		return A2(terezka$line_charts$LineChart$Coordinate$scaleSvgX, system, value - system.x.min) + system.frame.margin.left;
	});
var terezka$line_charts$Internal$Coordinate$lengthY = function (system) {
	return A2(elm$core$Basics$max, 1, (system.frame.size.height - system.frame.margin.bottom) - system.frame.margin.top);
};
var terezka$line_charts$Internal$Coordinate$reachY = function (system) {
	var diff = system.y.max - system.y.min;
	return (diff > 0) ? diff : 1;
};
var terezka$line_charts$LineChart$Coordinate$scaleSvgY = F2(
	function (system, value) {
		return (value * terezka$line_charts$Internal$Coordinate$lengthY(system)) / terezka$line_charts$Internal$Coordinate$reachY(system);
	});
var terezka$line_charts$LineChart$Coordinate$toSvgY = F2(
	function (system, value) {
		return A2(terezka$line_charts$LineChart$Coordinate$scaleSvgY, system, system.y.max - value) + system.frame.margin.top;
	});
var terezka$line_charts$LineChart$Coordinate$toSvg = F2(
	function (system, point) {
		return {
			x: A2(terezka$line_charts$LineChart$Coordinate$toSvgX, system, point.x),
			y: A2(terezka$line_charts$LineChart$Coordinate$toSvgY, system, point.y)
		};
	});
var terezka$line_charts$Internal$Path$translate = F2(
	function (system, command) {
		switch (command.$) {
			case 'Move':
				var p = command.a;
				return terezka$line_charts$Internal$Path$Move(
					A2(terezka$line_charts$LineChart$Coordinate$toSvg, system, p));
			case 'Line':
				var p = command.a;
				return terezka$line_charts$Internal$Path$Line(
					A2(terezka$line_charts$LineChart$Coordinate$toSvg, system, p));
			case 'Horizontal':
				var x = command.a;
				return terezka$line_charts$Internal$Path$Horizontal(
					A2(terezka$line_charts$LineChart$Coordinate$toSvgX, system, x));
			case 'Vertical':
				var y = command.a;
				return terezka$line_charts$Internal$Path$Vertical(
					A2(terezka$line_charts$LineChart$Coordinate$toSvgY, system, y));
			case 'CubicBeziers':
				var c1 = command.a;
				var c2 = command.b;
				var p = command.c;
				return A3(
					terezka$line_charts$Internal$Path$CubicBeziers,
					A2(terezka$line_charts$LineChart$Coordinate$toSvg, system, c1),
					A2(terezka$line_charts$LineChart$Coordinate$toSvg, system, c2),
					A2(terezka$line_charts$LineChart$Coordinate$toSvg, system, p));
			case 'CubicBeziersShort':
				var c1 = command.a;
				var p = command.b;
				return A2(
					terezka$line_charts$Internal$Path$CubicBeziersShort,
					A2(terezka$line_charts$LineChart$Coordinate$toSvg, system, c1),
					A2(terezka$line_charts$LineChart$Coordinate$toSvg, system, p));
			case 'QuadraticBeziers':
				var c1 = command.a;
				var p = command.b;
				return A2(
					terezka$line_charts$Internal$Path$QuadraticBeziers,
					A2(terezka$line_charts$LineChart$Coordinate$toSvg, system, c1),
					A2(terezka$line_charts$LineChart$Coordinate$toSvg, system, p));
			case 'QuadraticBeziersShort':
				var p = command.a;
				return terezka$line_charts$Internal$Path$QuadraticBeziersShort(
					A2(terezka$line_charts$LineChart$Coordinate$toSvg, system, p));
			case 'Arc':
				var rx = command.a;
				var ry = command.b;
				var xAxisRotation = command.c;
				var largeArcFlag = command.d;
				var sweepFlag = command.e;
				var p = command.f;
				return A6(
					terezka$line_charts$Internal$Path$Arc,
					rx,
					ry,
					xAxisRotation,
					largeArcFlag,
					sweepFlag,
					A2(terezka$line_charts$LineChart$Coordinate$toSvg, system, p));
			default:
				return terezka$line_charts$Internal$Path$Close;
		}
	});
var terezka$line_charts$Internal$Path$description = F2(
	function (system, commands) {
		return terezka$line_charts$Internal$Path$join(
			A2(
				elm$core$List$map,
				A2(
					elm$core$Basics$composeR,
					terezka$line_charts$Internal$Path$translate(system),
					terezka$line_charts$Internal$Path$toString),
				commands));
	});
var terezka$line_charts$Internal$Path$viewPath = function (attributes) {
	return A2(elm$svg$Svg$path, attributes, _List_Nil);
};
var terezka$line_charts$Internal$Path$view = F3(
	function (system, attributes, commands) {
		return terezka$line_charts$Internal$Path$viewPath(
			_Utils_ap(
				attributes,
				_List_fromArray(
					[
						elm$svg$Svg$Attributes$d(
						A2(terezka$line_charts$Internal$Path$description, system, commands))
					])));
	});
var terezka$line_charts$Internal$Utils$concat = F3(
	function (first, second, third) {
		return _Utils_ap(
			first,
			_Utils_ap(second, third));
	});
var avh4$elm_color$Color$scaleFrom255 = function (c) {
	return c / 255;
};
var avh4$elm_color$Color$rgb255 = F3(
	function (r, g, b) {
		return A4(
			avh4$elm_color$Color$RgbaSpace,
			avh4$elm_color$Color$scaleFrom255(r),
			avh4$elm_color$Color$scaleFrom255(g),
			avh4$elm_color$Color$scaleFrom255(b),
			1.0);
	});
var terezka$line_charts$LineChart$Colors$gray = A3(avh4$elm_color$Color$rgb255, 163, 163, 163);
var terezka$line_charts$Internal$Svg$horizontal = F5(
	function (system, userAttributes, y, x1, x2) {
		var attributes = A3(
			terezka$line_charts$Internal$Utils$concat,
			_List_fromArray(
				[
					elm$svg$Svg$Attributes$stroke(
					avh4$elm_color$Color$toCssString(terezka$line_charts$LineChart$Colors$gray)),
					elm$svg$Svg$Attributes$style('pointer-events: none;')
				]),
			userAttributes,
			_List_Nil);
		return A3(
			terezka$line_charts$Internal$Path$view,
			system,
			attributes,
			_List_fromArray(
				[
					terezka$line_charts$Internal$Path$Move(
					{x: x1, y: y}),
					terezka$line_charts$Internal$Path$Line(
					{x: x1, y: y}),
					terezka$line_charts$Internal$Path$Line(
					{x: x2, y: y})
				]));
	});
var terezka$line_charts$Internal$Axis$viewHorizontalAxisLine = F3(
	function (system, axisPosition, config) {
		return A5(
			terezka$line_charts$Internal$Svg$horizontal,
			system,
			A2(terezka$line_charts$Internal$Axis$attributesLine, system, config),
			axisPosition,
			config.start,
			config.end);
	});
var terezka$line_charts$Internal$Axis$attributesTick = function (_n0) {
	var width = _n0.width;
	var color = _n0.color;
	return _List_fromArray(
		[
			elm$svg$Svg$Attributes$strokeWidth(
			elm$core$String$fromFloat(width)),
			elm$svg$Svg$Attributes$stroke(
			avh4$elm_color$Color$toCssString(color))
		]);
};
var terezka$line_charts$Internal$Axis$Tick$isPositive = function (direction) {
	if (direction.$ === 'Positive') {
		return true;
	} else {
		return false;
	}
};
var terezka$line_charts$Internal$Axis$lengthOfTick = function (_n0) {
	var length = _n0.length;
	var direction = _n0.direction;
	return terezka$line_charts$Internal$Axis$Tick$isPositive(direction) ? (-length) : length;
};
var terezka$line_charts$Internal$Svg$Middle = {$: 'Middle'};
var terezka$line_charts$Internal$Svg$anchorStyle = function (anchor) {
	var anchorString = function () {
		switch (anchor.$) {
			case 'Start':
				return 'start';
			case 'Middle':
				return 'middle';
			default:
				return 'end';
		}
	}();
	return elm$svg$Svg$Attributes$style('text-anchor: ' + (anchorString + ';'));
};
var terezka$line_charts$Internal$Svg$Transfrom = F2(
	function (a, b) {
		return {$: 'Transfrom', a: a, b: b};
	});
var terezka$line_charts$Internal$Svg$move = F3(
	function (system, x, y) {
		return A2(
			terezka$line_charts$Internal$Svg$Transfrom,
			A2(terezka$line_charts$LineChart$Coordinate$toSvgX, system, x),
			A2(terezka$line_charts$LineChart$Coordinate$toSvgY, system, y));
	});
var terezka$line_charts$Internal$Svg$offset = F2(
	function (x, y) {
		return A2(terezka$line_charts$Internal$Svg$Transfrom, x, y);
	});
var elm$svg$Svg$Attributes$transform = _VirtualDom_attribute('transform');
var terezka$line_charts$Internal$Svg$addPosition = F2(
	function (_n0, _n1) {
		var x = _n0.a;
		var y = _n0.b;
		var xf = _n1.a;
		var yf = _n1.b;
		return A2(terezka$line_charts$Internal$Svg$Transfrom, xf + x, yf + y);
	});
var terezka$line_charts$Internal$Svg$toPosition = A2(
	elm$core$List$foldr,
	terezka$line_charts$Internal$Svg$addPosition,
	A2(terezka$line_charts$Internal$Svg$Transfrom, 0, 0));
var terezka$line_charts$Internal$Svg$transform = function (translations) {
	var _n0 = terezka$line_charts$Internal$Svg$toPosition(translations);
	var x = _n0.a;
	var y = _n0.b;
	return elm$svg$Svg$Attributes$transform(
		'translate(' + (elm$core$String$fromFloat(x) + (', ' + (elm$core$String$fromFloat(y) + ')'))));
};
var terezka$line_charts$Internal$Axis$viewHorizontalLabel = F4(
	function (system, _n0, position, view) {
		var direction = _n0.direction;
		var length = _n0.length;
		var yOffset = terezka$line_charts$Internal$Axis$Tick$isPositive(direction) ? ((-5) - length) : (15 + length);
		return A2(
			elm$svg$Svg$g,
			_List_fromArray(
				[
					terezka$line_charts$Internal$Svg$transform(
					_List_fromArray(
						[
							A3(terezka$line_charts$Internal$Svg$move, system, position.x, position.y),
							A2(terezka$line_charts$Internal$Svg$offset, 0, yOffset)
						])),
					terezka$line_charts$Internal$Svg$anchorStyle(terezka$line_charts$Internal$Svg$Middle)
				]),
			_List_fromArray(
				[view]));
	});
var elm$svg$Svg$line = elm$svg$Svg$trustedNode('line');
var elm$svg$Svg$Attributes$x1 = _VirtualDom_attribute('x1');
var elm$svg$Svg$Attributes$x2 = _VirtualDom_attribute('x2');
var elm$svg$Svg$Attributes$y1 = _VirtualDom_attribute('y1');
var elm$svg$Svg$Attributes$y2 = _VirtualDom_attribute('y2');
var terezka$line_charts$Internal$Svg$xTick = F5(
	function (system, height, userAttributes, y, x) {
		var attributes = A3(
			terezka$line_charts$Internal$Utils$concat,
			_List_fromArray(
				[
					elm$svg$Svg$Attributes$stroke(
					avh4$elm_color$Color$toCssString(terezka$line_charts$LineChart$Colors$gray))
				]),
			userAttributes,
			_List_fromArray(
				[
					elm$svg$Svg$Attributes$x1(
					elm$core$String$fromFloat(
						A2(terezka$line_charts$LineChart$Coordinate$toSvgX, system, x))),
					elm$svg$Svg$Attributes$x2(
					elm$core$String$fromFloat(
						A2(terezka$line_charts$LineChart$Coordinate$toSvgX, system, x))),
					elm$svg$Svg$Attributes$y1(
					elm$core$String$fromFloat(
						A2(terezka$line_charts$LineChart$Coordinate$toSvgY, system, y))),
					elm$svg$Svg$Attributes$y2(
					elm$core$String$fromFloat(
						A2(terezka$line_charts$LineChart$Coordinate$toSvgY, system, y) + height))
				]));
		return A2(elm$svg$Svg$line, attributes, _List_Nil);
	});
var elm$svg$Svg$text = elm$virtual_dom$VirtualDom$text;
var terezka$line_charts$Internal$Utils$viewMaybe = F2(
	function (a, view) {
		return A2(
			elm$core$Maybe$withDefault,
			elm$svg$Svg$text(''),
			A2(elm$core$Maybe$map, view, a));
	});
var terezka$line_charts$Internal$Axis$viewHorizontalTick = F3(
	function (system, point, tick) {
		var x = point.x;
		var y = point.y;
		return A2(
			elm$svg$Svg$g,
			_List_fromArray(
				[
					elm$svg$Svg$Attributes$class('chart__tick')
				]),
			_List_fromArray(
				[
					A5(
					terezka$line_charts$Internal$Svg$xTick,
					system,
					terezka$line_charts$Internal$Axis$lengthOfTick(tick),
					terezka$line_charts$Internal$Axis$attributesTick(tick),
					y,
					x),
					A2(
					terezka$line_charts$Internal$Utils$viewMaybe,
					tick.label,
					A3(terezka$line_charts$Internal$Axis$viewHorizontalLabel, system, tick, point))
				]));
	});
var terezka$line_charts$Internal$Svg$Start = {$: 'Start'};
var terezka$line_charts$Internal$Axis$viewHorizontalTitle = F3(
	function (system, at, _n0) {
		var title = _n0.title;
		var position = at(
			A2(title.position, system.xData, system.x));
		var _n1 = title.offset;
		var xOffset = _n1.a;
		var yOffset = _n1.b;
		return A2(
			elm$svg$Svg$g,
			_List_fromArray(
				[
					elm$svg$Svg$Attributes$class('chart__title'),
					terezka$line_charts$Internal$Svg$transform(
					_List_fromArray(
						[
							A3(terezka$line_charts$Internal$Svg$move, system, position.x, position.y),
							A2(terezka$line_charts$Internal$Svg$offset, xOffset + 15, yOffset + 5)
						])),
					terezka$line_charts$Internal$Svg$anchorStyle(terezka$line_charts$Internal$Svg$Start)
				]),
			_List_fromArray(
				[title.view]));
	});
var terezka$line_charts$Internal$Axis$Intersection$getY = function (_n0) {
	var func = _n0.a;
	return A2(
		elm$core$Basics$composeL,
		function ($) {
			return $.y;
		},
		func);
};
var terezka$line_charts$Internal$Axis$Line$config = function (_n0) {
	var config_ = _n0.a;
	return config_;
};
var terezka$line_charts$Internal$Axis$Tick$properties = function (_n0) {
	var properties_ = _n0.a;
	return properties_;
};
var terezka$line_charts$Internal$Axis$Ticks$ticks = F3(
	function (dataRange, range, _n0) {
		var values = _n0.a;
		return A2(
			elm$core$List$map,
			terezka$line_charts$Internal$Axis$Tick$properties,
			A2(values, dataRange, range));
	});
var terezka$line_charts$Internal$Axis$Title$config = function (_n0) {
	var title = _n0.a;
	return title;
};
var terezka$line_charts$Internal$Axis$viewHorizontal = F3(
	function (system, intersection, _n0) {
		var config = _n0.a;
		var viewConfig = {
			intersection: A2(terezka$line_charts$Internal$Axis$Intersection$getY, intersection, system),
			line: A3(terezka$line_charts$Internal$Axis$Line$config, config.axisLine, system.xData, system.x),
			ticks: A3(terezka$line_charts$Internal$Axis$Ticks$ticks, system.xData, system.x, config.ticks),
			title: terezka$line_charts$Internal$Axis$Title$config(config.title)
		};
		var viewAxisLine = A2(terezka$line_charts$Internal$Axis$viewHorizontalAxisLine, system, viewConfig.intersection);
		var at = function (x) {
			return {x: x, y: viewConfig.intersection};
		};
		var viewTick = function (tick) {
			return A3(
				terezka$line_charts$Internal$Axis$viewHorizontalTick,
				system,
				at(tick.position),
				tick);
		};
		return A2(
			elm$svg$Svg$g,
			_List_fromArray(
				[
					elm$svg$Svg$Attributes$class('chart__axis--horizontal')
				]),
			_List_fromArray(
				[
					A3(terezka$line_charts$Internal$Axis$viewHorizontalTitle, system, at, viewConfig),
					viewAxisLine(viewConfig.line),
					A2(
					elm$svg$Svg$g,
					_List_fromArray(
						[
							elm$svg$Svg$Attributes$class('chart__ticks')
						]),
					A2(elm$core$List$map, viewTick, viewConfig.ticks))
				]));
	});
var terezka$line_charts$Internal$Svg$vertical = F5(
	function (system, userAttributes, x, y1, y2) {
		var attributes = A3(
			terezka$line_charts$Internal$Utils$concat,
			_List_fromArray(
				[
					elm$svg$Svg$Attributes$stroke(
					avh4$elm_color$Color$toCssString(terezka$line_charts$LineChart$Colors$gray)),
					elm$svg$Svg$Attributes$style('pointer-events: none;')
				]),
			userAttributes,
			_List_Nil);
		return A3(
			terezka$line_charts$Internal$Path$view,
			system,
			attributes,
			_List_fromArray(
				[
					terezka$line_charts$Internal$Path$Move(
					{x: x, y: y1}),
					terezka$line_charts$Internal$Path$Line(
					{x: x, y: y1}),
					terezka$line_charts$Internal$Path$Line(
					{x: x, y: y2})
				]));
	});
var terezka$line_charts$Internal$Axis$viewVerticalAxisLine = F3(
	function (system, axisPosition, config) {
		return A5(
			terezka$line_charts$Internal$Svg$vertical,
			system,
			A2(terezka$line_charts$Internal$Axis$attributesLine, system, config),
			axisPosition,
			config.start,
			config.end);
	});
var terezka$line_charts$Internal$Svg$End = {$: 'End'};
var terezka$line_charts$Internal$Axis$viewVerticalLabel = F4(
	function (system, _n0, position, view) {
		var direction = _n0.direction;
		var length = _n0.length;
		var xOffset = terezka$line_charts$Internal$Axis$Tick$isPositive(direction) ? (5 + length) : ((-5) - length);
		var anchor = terezka$line_charts$Internal$Axis$Tick$isPositive(direction) ? terezka$line_charts$Internal$Svg$Start : terezka$line_charts$Internal$Svg$End;
		return A2(
			elm$svg$Svg$g,
			_List_fromArray(
				[
					terezka$line_charts$Internal$Svg$transform(
					_List_fromArray(
						[
							A3(terezka$line_charts$Internal$Svg$move, system, position.x, position.y),
							A2(terezka$line_charts$Internal$Svg$offset, xOffset, 5)
						])),
					terezka$line_charts$Internal$Svg$anchorStyle(anchor)
				]),
			_List_fromArray(
				[view]));
	});
var terezka$line_charts$Internal$Svg$yTick = F5(
	function (system, width, userAttributes, x, y) {
		var attributes = A3(
			terezka$line_charts$Internal$Utils$concat,
			_List_fromArray(
				[
					elm$svg$Svg$Attributes$class('chart__tick'),
					elm$svg$Svg$Attributes$stroke(
					avh4$elm_color$Color$toCssString(terezka$line_charts$LineChart$Colors$gray))
				]),
			userAttributes,
			_List_fromArray(
				[
					elm$svg$Svg$Attributes$x1(
					elm$core$String$fromFloat(
						A2(terezka$line_charts$LineChart$Coordinate$toSvgX, system, x))),
					elm$svg$Svg$Attributes$x2(
					elm$core$String$fromFloat(
						A2(terezka$line_charts$LineChart$Coordinate$toSvgX, system, x) - width)),
					elm$svg$Svg$Attributes$y1(
					elm$core$String$fromFloat(
						A2(terezka$line_charts$LineChart$Coordinate$toSvgY, system, y))),
					elm$svg$Svg$Attributes$y2(
					elm$core$String$fromFloat(
						A2(terezka$line_charts$LineChart$Coordinate$toSvgY, system, y)))
				]));
		return A2(elm$svg$Svg$line, attributes, _List_Nil);
	});
var terezka$line_charts$Internal$Axis$viewVerticalTick = F3(
	function (system, point, tick) {
		var x = point.x;
		var y = point.y;
		return A2(
			elm$svg$Svg$g,
			_List_fromArray(
				[
					elm$svg$Svg$Attributes$class('chart__tick')
				]),
			_List_fromArray(
				[
					A5(
					terezka$line_charts$Internal$Svg$yTick,
					system,
					terezka$line_charts$Internal$Axis$lengthOfTick(tick),
					terezka$line_charts$Internal$Axis$attributesTick(tick),
					x,
					y),
					A2(
					terezka$line_charts$Internal$Utils$viewMaybe,
					tick.label,
					A3(terezka$line_charts$Internal$Axis$viewVerticalLabel, system, tick, point))
				]));
	});
var terezka$line_charts$Internal$Axis$viewVerticalTitle = F3(
	function (system, at, _n0) {
		var title = _n0.title;
		var position = at(
			A2(title.position, system.yData, system.y));
		var _n1 = title.offset;
		var xOffset = _n1.a;
		var yOffset = _n1.b;
		return A2(
			elm$svg$Svg$g,
			_List_fromArray(
				[
					elm$svg$Svg$Attributes$class('chart__title'),
					terezka$line_charts$Internal$Svg$transform(
					_List_fromArray(
						[
							A3(terezka$line_charts$Internal$Svg$move, system, position.x, position.y),
							A2(terezka$line_charts$Internal$Svg$offset, xOffset + 2, yOffset - 10)
						])),
					terezka$line_charts$Internal$Svg$anchorStyle(terezka$line_charts$Internal$Svg$End)
				]),
			_List_fromArray(
				[title.view]));
	});
var terezka$line_charts$Internal$Axis$Intersection$getX = function (_n0) {
	var func = _n0.a;
	return A2(
		elm$core$Basics$composeL,
		function ($) {
			return $.x;
		},
		func);
};
var terezka$line_charts$Internal$Axis$viewVertical = F3(
	function (system, intersection, _n0) {
		var config = _n0.a;
		var viewConfig = {
			intersection: A2(terezka$line_charts$Internal$Axis$Intersection$getX, intersection, system),
			line: A3(terezka$line_charts$Internal$Axis$Line$config, config.axisLine, system.yData, system.y),
			ticks: A3(terezka$line_charts$Internal$Axis$Ticks$ticks, system.yData, system.y, config.ticks),
			title: terezka$line_charts$Internal$Axis$Title$config(config.title)
		};
		var viewAxisLine = A2(terezka$line_charts$Internal$Axis$viewVerticalAxisLine, system, viewConfig.intersection);
		var at = function (y) {
			return {x: viewConfig.intersection, y: y};
		};
		var viewTick = function (tick) {
			return A3(
				terezka$line_charts$Internal$Axis$viewVerticalTick,
				system,
				at(tick.position),
				tick);
		};
		return A2(
			elm$svg$Svg$g,
			_List_fromArray(
				[
					elm$svg$Svg$Attributes$class('chart__axis--vertical')
				]),
			_List_fromArray(
				[
					A3(terezka$line_charts$Internal$Axis$viewVerticalTitle, system, at, viewConfig),
					viewAxisLine(viewConfig.line),
					A2(
					elm$svg$Svg$g,
					_List_fromArray(
						[
							elm$svg$Svg$Attributes$class('chart__ticks')
						]),
					A2(elm$core$List$map, viewTick, viewConfig.ticks))
				]));
	});
var terezka$line_charts$Internal$Container$properties = F2(
	function (f, _n0) {
		var properties_ = _n0.a;
		return f(properties_);
	});
var terezka$line_charts$Internal$Events$toContainerAttributes = F3(
	function (data, system, _n0) {
		var events = _n0.a;
		var order = function (_n1) {
			var outside = _n1.a;
			var event = _n1.b;
			return outside ? elm$core$Maybe$Just(
				A2(event, data, system)) : elm$core$Maybe$Nothing;
		};
		return A2(elm$core$List$filterMap, order, events);
	});
var terezka$line_charts$Internal$Axis$ticks = function (_n0) {
	var config = _n0.a;
	return config.ticks;
};
var elm$core$List$concatMap = F2(
	function (f, list) {
		return elm$core$List$concat(
			A2(elm$core$List$map, f, list));
	});
var elm$svg$Svg$circle = elm$svg$Svg$trustedNode('circle');
var elm$svg$Svg$Attributes$cx = _VirtualDom_attribute('cx');
var elm$svg$Svg$Attributes$cy = _VirtualDom_attribute('cy');
var elm$svg$Svg$Attributes$r = _VirtualDom_attribute('r');
var terezka$line_charts$Internal$Svg$gridDot = F3(
	function (radius, color, point) {
		return A2(
			elm$svg$Svg$circle,
			_List_fromArray(
				[
					elm$svg$Svg$Attributes$cx(
					elm$core$String$fromFloat(point.x)),
					elm$svg$Svg$Attributes$cy(
					elm$core$String$fromFloat(point.y)),
					elm$svg$Svg$Attributes$r(
					elm$core$String$fromFloat(radius)),
					elm$svg$Svg$Attributes$fill(
					avh4$elm_color$Color$toCssString(color))
				]),
			_List_Nil);
	});
var terezka$line_charts$LineChart$Coordinate$Point = F2(
	function (x, y) {
		return {x: x, y: y};
	});
var terezka$line_charts$Internal$Grid$viewDots = F5(
	function (system, verticals, horizontals, radius, color) {
		var dot = F2(
			function (x, y) {
				return A2(
					terezka$line_charts$LineChart$Coordinate$toSvg,
					system,
					A2(terezka$line_charts$LineChart$Coordinate$Point, x, y));
			});
		var dots_ = function (g) {
			return A2(
				elm$core$List$map,
				dot(g),
				horizontals);
		};
		var alldots = A2(elm$core$List$concatMap, dots_, verticals);
		return A2(
			elm$core$List$map,
			A2(terezka$line_charts$Internal$Svg$gridDot, radius, color),
			alldots);
	});
var terezka$line_charts$Internal$Svg$horizontalGrid = F3(
	function (system, userAttributes, y) {
		var attributes = A3(
			terezka$line_charts$Internal$Utils$concat,
			_List_fromArray(
				[
					elm$svg$Svg$Attributes$stroke(
					avh4$elm_color$Color$toCssString(terezka$line_charts$LineChart$Colors$gray)),
					elm$svg$Svg$Attributes$style('pointer-events: none;')
				]),
			userAttributes,
			_List_Nil);
		return A5(terezka$line_charts$Internal$Svg$horizontal, system, attributes, y, system.x.min, system.x.max);
	});
var terezka$line_charts$Internal$Svg$verticalGrid = F3(
	function (system, userAttributes, x) {
		var attributes = A3(
			terezka$line_charts$Internal$Utils$concat,
			_List_fromArray(
				[
					elm$svg$Svg$Attributes$stroke(
					avh4$elm_color$Color$toCssString(terezka$line_charts$LineChart$Colors$gray)),
					elm$svg$Svg$Attributes$style('pointer-events: none;')
				]),
			userAttributes,
			_List_Nil);
		return A5(terezka$line_charts$Internal$Svg$vertical, system, attributes, x, system.y.min, system.y.max);
	});
var terezka$line_charts$Internal$Grid$viewLines = F5(
	function (system, verticals, horizontals, width, color) {
		var attributes = _List_fromArray(
			[
				elm$svg$Svg$Attributes$strokeWidth(
				elm$core$String$fromFloat(width)),
				elm$svg$Svg$Attributes$stroke(
				avh4$elm_color$Color$toCssString(color))
			]);
		return _Utils_ap(
			A2(
				elm$core$List$map,
				A2(terezka$line_charts$Internal$Svg$horizontalGrid, system, attributes),
				horizontals),
			A2(
				elm$core$List$map,
				A2(terezka$line_charts$Internal$Svg$verticalGrid, system, attributes),
				verticals));
	});
var terezka$line_charts$Internal$Grid$view = F4(
	function (system, xAxis, yAxis, grid) {
		var hasGrid = function (tick) {
			return tick.grid ? elm$core$Maybe$Just(tick.position) : elm$core$Maybe$Nothing;
		};
		var horizontals = A2(
			elm$core$List$filterMap,
			hasGrid,
			A3(
				terezka$line_charts$Internal$Axis$Ticks$ticks,
				system.yData,
				system.y,
				terezka$line_charts$Internal$Axis$ticks(yAxis)));
		var verticals = A2(
			elm$core$List$filterMap,
			hasGrid,
			A3(
				terezka$line_charts$Internal$Axis$Ticks$ticks,
				system.xData,
				system.x,
				terezka$line_charts$Internal$Axis$ticks(xAxis)));
		if (grid.$ === 'Dots') {
			var radius = grid.a;
			var color = grid.b;
			return A5(terezka$line_charts$Internal$Grid$viewDots, system, verticals, horizontals, radius, color);
		} else {
			var width = grid.a;
			var color = grid.b;
			return A5(terezka$line_charts$Internal$Grid$viewLines, system, verticals, horizontals, width, color);
		}
	});
var terezka$line_charts$Internal$Junk$addBelow = F2(
	function (below, layers) {
		return _Utils_update(
			layers,
			{
				below: _Utils_ap(below, layers.below)
			});
	});
var terezka$line_charts$Internal$Junk$getLayers = F5(
	function (series, toX, toY, system, _n0) {
		var toLayers = _n0.a;
		return A4(toLayers, series, toX, toY, system);
	});
var terezka$line_charts$Internal$Line$label = function (_n0) {
	var config = _n0.a;
	return config.label;
};
var terezka$line_charts$Internal$Legends$viewFree = F5(
	function (system, placement, viewLabel, line, data) {
		var _n0 = function () {
			if (placement.$ === 'Beginning') {
				return _Utils_Tuple3(data, terezka$line_charts$Internal$Svg$End, -10);
			} else {
				return _Utils_Tuple3(
					elm$core$List$reverse(data),
					terezka$line_charts$Internal$Svg$Start,
					10);
			}
		}();
		var orderedPoints = _n0.a;
		var anchor = _n0.b;
		var xOffset = _n0.c;
		var transform = function (_n3) {
			var x = _n3.x;
			var y = _n3.y;
			return terezka$line_charts$Internal$Svg$transform(
				_List_fromArray(
					[
						A3(terezka$line_charts$Internal$Svg$move, system, x, y),
						A2(terezka$line_charts$Internal$Svg$offset, xOffset, 3)
					]));
		};
		var viewLegend = function (_n2) {
			var point = _n2.point;
			return A2(
				elm$svg$Svg$g,
				_List_fromArray(
					[
						transform(point),
						terezka$line_charts$Internal$Svg$anchorStyle(anchor)
					]),
				_List_fromArray(
					[
						viewLabel(
						terezka$line_charts$Internal$Line$label(line))
					]));
		};
		return A2(
			terezka$line_charts$Internal$Utils$viewMaybe,
			elm$core$List$head(orderedPoints),
			viewLegend);
	});
var terezka$line_charts$Internal$Legends$viewFrees = F3(
	function (_n0, placement, view_) {
		var system = _n0.system;
		var lines = _n0.lines;
		var data = _n0.data;
		return A2(
			elm$svg$Svg$g,
			_List_fromArray(
				[
					elm$svg$Svg$Attributes$class('chart__legends')
				]),
			A3(
				elm$core$List$map2,
				A3(terezka$line_charts$Internal$Legends$viewFree, system, placement, view_),
				lines,
				data));
	});
var terezka$line_charts$Internal$Data$Point = F2(
	function (x, y) {
		return {x: x, y: y};
	});
var elm$core$Basics$sqrt = _Basics_sqrt;
var elm$svg$Svg$Attributes$strokeOpacity = _VirtualDom_attribute('stroke-opacity');
var terezka$line_charts$Internal$Dots$varietyAttributes = F2(
	function (color, variety) {
		switch (variety.$) {
			case 'Empty':
				var width = variety.a;
				return _List_fromArray(
					[
						elm$svg$Svg$Attributes$stroke(
						avh4$elm_color$Color$toCssString(color)),
						elm$svg$Svg$Attributes$strokeWidth(
						elm$core$String$fromInt(width)),
						elm$svg$Svg$Attributes$fill('white')
					]);
			case 'Aura':
				var width = variety.a;
				var opacity = variety.b;
				return _List_fromArray(
					[
						elm$svg$Svg$Attributes$stroke(
						avh4$elm_color$Color$toCssString(color)),
						elm$svg$Svg$Attributes$strokeWidth(
						elm$core$String$fromInt(width)),
						elm$svg$Svg$Attributes$strokeOpacity(
						elm$core$String$fromFloat(opacity)),
						elm$svg$Svg$Attributes$fill(
						avh4$elm_color$Color$toCssString(color))
					]);
			case 'Disconnected':
				var width = variety.a;
				return _List_fromArray(
					[
						elm$svg$Svg$Attributes$stroke('white'),
						elm$svg$Svg$Attributes$strokeWidth(
						elm$core$String$fromInt(width)),
						elm$svg$Svg$Attributes$fill(
						avh4$elm_color$Color$toCssString(color))
					]);
			default:
				return _List_fromArray(
					[
						elm$svg$Svg$Attributes$fill(
						avh4$elm_color$Color$toCssString(color))
					]);
		}
	});
var terezka$line_charts$Internal$Dots$viewCircle = F5(
	function (events, variety, color, area, point) {
		var radius = elm$core$Basics$sqrt(area / elm$core$Basics$pi);
		var attributes = _List_fromArray(
			[
				elm$svg$Svg$Attributes$cx(
				elm$core$String$fromFloat(point.x)),
				elm$svg$Svg$Attributes$cy(
				elm$core$String$fromFloat(point.y)),
				elm$svg$Svg$Attributes$r(
				elm$core$String$fromFloat(radius))
			]);
		return A2(
			elm$svg$Svg$circle,
			_Utils_ap(
				events,
				_Utils_ap(
					attributes,
					A2(terezka$line_charts$Internal$Dots$varietyAttributes, color, variety))),
			_List_Nil);
	});
var terezka$line_charts$Internal$Dots$pathPlus = F2(
	function (area, point) {
		var side = elm$core$Basics$sqrt(area / 5);
		var r6 = side / 2;
		var r3 = side;
		var commands = _List_fromArray(
			[
				'M' + (elm$core$String$fromFloat(point.x - r6) + (' ' + elm$core$String$fromFloat((point.y - r3) - r6))),
				'v' + elm$core$String$fromFloat(r3),
				'h' + elm$core$String$fromFloat(-r3),
				'v' + elm$core$String$fromFloat(r3),
				'h' + elm$core$String$fromFloat(r3),
				'v' + elm$core$String$fromFloat(r3),
				'h' + elm$core$String$fromFloat(r3),
				'v' + elm$core$String$fromFloat(-r3),
				'h' + elm$core$String$fromFloat(r3),
				'v' + elm$core$String$fromFloat(-r3),
				'h' + elm$core$String$fromFloat(-r3),
				'v' + elm$core$String$fromFloat(-r3),
				'h' + elm$core$String$fromFloat(-r3),
				'v' + elm$core$String$fromFloat(r3)
			]);
		return A2(elm$core$String$join, ' ', commands);
	});
var terezka$line_charts$Internal$Dots$viewCross = F5(
	function (events, variety, color, area, point) {
		var rotation = 'rotate(45 ' + (elm$core$String$fromFloat(point.x) + (' ' + (elm$core$String$fromFloat(point.y) + ')')));
		var attributes = _List_fromArray(
			[
				elm$svg$Svg$Attributes$d(
				A2(terezka$line_charts$Internal$Dots$pathPlus, area, point)),
				elm$svg$Svg$Attributes$transform(rotation)
			]);
		return A2(
			elm$svg$Svg$path,
			_Utils_ap(
				events,
				_Utils_ap(
					attributes,
					A2(terezka$line_charts$Internal$Dots$varietyAttributes, color, variety))),
			_List_Nil);
	});
var elm$svg$Svg$rect = elm$svg$Svg$trustedNode('rect');
var elm$svg$Svg$Attributes$height = _VirtualDom_attribute('height');
var elm$svg$Svg$Attributes$width = _VirtualDom_attribute('width');
var elm$svg$Svg$Attributes$x = _VirtualDom_attribute('x');
var elm$svg$Svg$Attributes$y = _VirtualDom_attribute('y');
var terezka$line_charts$Internal$Dots$viewDiamond = F5(
	function (events, variety, color, area, point) {
		var side = elm$core$Basics$sqrt(area);
		var rotation = 'rotate(45 ' + (elm$core$String$fromFloat(point.x) + (' ' + (elm$core$String$fromFloat(point.y) + ')')));
		var attributes = _List_fromArray(
			[
				elm$svg$Svg$Attributes$x(
				elm$core$String$fromFloat(point.x - (side / 2))),
				elm$svg$Svg$Attributes$y(
				elm$core$String$fromFloat(point.y - (side / 2))),
				elm$svg$Svg$Attributes$width(
				elm$core$String$fromFloat(side)),
				elm$svg$Svg$Attributes$height(
				elm$core$String$fromFloat(side)),
				elm$svg$Svg$Attributes$transform(rotation)
			]);
		return A2(
			elm$svg$Svg$rect,
			_Utils_ap(
				events,
				_Utils_ap(
					attributes,
					A2(terezka$line_charts$Internal$Dots$varietyAttributes, color, variety))),
			_List_Nil);
	});
var terezka$line_charts$Internal$Dots$viewPlus = F5(
	function (events, variety, color, area, point) {
		var attributes = _List_fromArray(
			[
				elm$svg$Svg$Attributes$d(
				A2(terezka$line_charts$Internal$Dots$pathPlus, area, point))
			]);
		return A2(
			elm$svg$Svg$path,
			_Utils_ap(
				events,
				_Utils_ap(
					attributes,
					A2(terezka$line_charts$Internal$Dots$varietyAttributes, color, variety))),
			_List_Nil);
	});
var terezka$line_charts$Internal$Dots$viewSquare = F5(
	function (events, variety, color, area, point) {
		var side = elm$core$Basics$sqrt(area);
		var attributes = _List_fromArray(
			[
				elm$svg$Svg$Attributes$x(
				elm$core$String$fromFloat(point.x - (side / 2))),
				elm$svg$Svg$Attributes$y(
				elm$core$String$fromFloat(point.y - (side / 2))),
				elm$svg$Svg$Attributes$width(
				elm$core$String$fromFloat(side)),
				elm$svg$Svg$Attributes$height(
				elm$core$String$fromFloat(side))
			]);
		return A2(
			elm$svg$Svg$rect,
			_Utils_ap(
				events,
				_Utils_ap(
					attributes,
					A2(terezka$line_charts$Internal$Dots$varietyAttributes, color, variety))),
			_List_Nil);
	});
var elm$core$Basics$tan = _Basics_tan;
var terezka$line_charts$Internal$Dots$pathTriangle = F2(
	function (area, point) {
		var side = elm$core$Basics$sqrt(
			(area * 4) / elm$core$Basics$sqrt(3));
		var height = (elm$core$Basics$sqrt(3) * side) / 2;
		var fromMiddle = height - ((elm$core$Basics$tan(
			elm$core$Basics$degrees(30)) * side) / 2);
		var commands = _List_fromArray(
			[
				'M' + (elm$core$String$fromFloat(point.x) + (' ' + elm$core$String$fromFloat(point.y - fromMiddle))),
				'l' + (elm$core$String$fromFloat((-side) / 2) + (' ' + elm$core$String$fromFloat(height))),
				'h' + elm$core$String$fromFloat(side),
				'z'
			]);
		return A2(elm$core$String$join, ' ', commands);
	});
var terezka$line_charts$Internal$Dots$viewTriangle = F5(
	function (events, variety, color, area, point) {
		var attributes = _List_fromArray(
			[
				elm$svg$Svg$Attributes$d(
				A2(terezka$line_charts$Internal$Dots$pathTriangle, area, point))
			]);
		return A2(
			elm$svg$Svg$path,
			_Utils_ap(
				events,
				_Utils_ap(
					attributes,
					A2(terezka$line_charts$Internal$Dots$varietyAttributes, color, variety))),
			_List_Nil);
	});
var terezka$line_charts$Internal$Dots$viewShape = F5(
	function (system, _n0, shape, color, point) {
		var radius = _n0.radius;
		var variety = _n0.variety;
		var view_ = function () {
			switch (shape.$) {
				case 'Circle':
					return terezka$line_charts$Internal$Dots$viewCircle;
				case 'Triangle':
					return terezka$line_charts$Internal$Dots$viewTriangle;
				case 'Square':
					return terezka$line_charts$Internal$Dots$viewSquare;
				case 'Diamond':
					return terezka$line_charts$Internal$Dots$viewDiamond;
				case 'Cross':
					return terezka$line_charts$Internal$Dots$viewCross;
				case 'Plus':
					return terezka$line_charts$Internal$Dots$viewPlus;
				default:
					return F5(
						function (_n2, _n3, _n4, _n5, _n6) {
							return elm$svg$Svg$text('');
						});
			}
		}();
		var size = (2 * elm$core$Basics$pi) * radius;
		var pointSvg = A2(terezka$line_charts$LineChart$Coordinate$toSvg, system, point);
		return A5(view_, _List_Nil, variety, color, size, pointSvg);
	});
var terezka$line_charts$Internal$Dots$viewSample = F5(
	function (_n0, shape, color, system, data) {
		var config = _n0.a;
		var _n1 = config.legend(
			A2(
				elm$core$List$map,
				function ($) {
					return $.user;
				},
				data));
		var style_ = _n1.a;
		return A4(terezka$line_charts$Internal$Dots$viewShape, system, style_, shape, color);
	});
var terezka$line_charts$Internal$Line$color = F3(
	function (_n0, _n1, data_) {
		var config = _n0.a;
		var line_ = _n1.a;
		var _n2 = config(
			A2(
				elm$core$List$map,
				function ($) {
					return $.user;
				},
				data_));
		var style_ = _n2.a;
		return style_.color(line_.color);
	});
var terezka$line_charts$Internal$Line$shape = function (_n0) {
	var config = _n0.a;
	return config.shape;
};
var elm$svg$Svg$Attributes$fillOpacity = _VirtualDom_attribute('fill-opacity');
var terezka$line_charts$Internal$Area$hasArea = function (config) {
	switch (config.$) {
		case 'None':
			return false;
		case 'Normal':
			return true;
		case 'Stacked':
			return true;
		default:
			return true;
	}
};
var terezka$line_charts$Internal$Area$opacity = function (config) {
	switch (config.$) {
		case 'None':
			return 0;
		case 'Normal':
			var opacity_ = config.a;
			return opacity_;
		case 'Stacked':
			var opacity_ = config.a;
			return opacity_;
		default:
			var opacity_ = config.a;
			return opacity_;
	}
};
var terezka$line_charts$Internal$Line$toAreaAttributes = F3(
	function (_n0, _n1, area) {
		var serie = _n0.a;
		var style_ = _n1.a;
		return _List_fromArray(
			[
				elm$svg$Svg$Attributes$class('chart__interpolation__area__fragment'),
				elm$svg$Svg$Attributes$fill(
				avh4$elm_color$Color$toCssString(
					style_.color(serie.color)))
			]);
	});
var elm$svg$Svg$Attributes$strokeDasharray = _VirtualDom_attribute('stroke-dasharray');
var terezka$line_charts$Internal$Line$toSeriesAttributes = F2(
	function (_n0, _n1) {
		var serie = _n0.a;
		var style_ = _n1.a;
		return _List_fromArray(
			[
				elm$svg$Svg$Attributes$style('pointer-events: none;'),
				elm$svg$Svg$Attributes$class('chart__interpolation__line__fragment'),
				elm$svg$Svg$Attributes$stroke(
				avh4$elm_color$Color$toCssString(
					style_.color(serie.color))),
				elm$svg$Svg$Attributes$strokeWidth(
				elm$core$String$fromFloat(style_.width)),
				elm$svg$Svg$Attributes$strokeDasharray(
				A2(
					elm$core$String$join,
					' ',
					A2(elm$core$List$map, elm$core$String$fromFloat, serie.dashing))),
				elm$svg$Svg$Attributes$fill('transparent')
			]);
	});
var terezka$line_charts$Internal$Utils$viewIf = F2(
	function (condition, view) {
		return condition ? view(_Utils_Tuple0) : elm$svg$Svg$text('');
	});
var terezka$line_charts$Internal$Line$viewSample = F5(
	function (_n0, line_, area, data_, sampleWidth) {
		var look = _n0.a;
		var style_ = look(
			A2(
				elm$core$List$map,
				function ($) {
					return $.user;
				},
				data_));
		var sizeAttributes = _List_fromArray(
			[
				elm$svg$Svg$Attributes$x1('0'),
				elm$svg$Svg$Attributes$y1('0'),
				elm$svg$Svg$Attributes$x2(
				elm$core$String$fromFloat(sampleWidth)),
				elm$svg$Svg$Attributes$y2('0')
			]);
		var rectangleAttributes = _List_fromArray(
			[
				elm$svg$Svg$Attributes$x('0'),
				elm$svg$Svg$Attributes$y('0'),
				elm$svg$Svg$Attributes$height('9'),
				elm$svg$Svg$Attributes$width(
				elm$core$String$fromFloat(sampleWidth))
			]);
		var lineAttributes = A2(terezka$line_charts$Internal$Line$toSeriesAttributes, line_, style_);
		var areaAttributes = A2(
			elm$core$List$cons,
			elm$svg$Svg$Attributes$fillOpacity(
				elm$core$String$fromFloat(
					terezka$line_charts$Internal$Area$opacity(area))),
			A3(terezka$line_charts$Internal$Line$toAreaAttributes, line_, style_, area));
		var viewRectangle = function (_n1) {
			return A2(
				elm$svg$Svg$rect,
				_Utils_ap(areaAttributes, rectangleAttributes),
				_List_Nil);
		};
		return A2(
			elm$svg$Svg$g,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					elm$svg$Svg$line,
					_Utils_ap(lineAttributes, sizeAttributes),
					_List_Nil),
					A2(
					terezka$line_charts$Internal$Utils$viewIf,
					terezka$line_charts$Internal$Area$hasArea(area),
					viewRectangle)
				]));
	});
var terezka$line_charts$LineChart$Coordinate$scaleDataX = F2(
	function (system, value) {
		return (value * terezka$line_charts$Internal$Coordinate$reachX(system)) / terezka$line_charts$Internal$Coordinate$lengthX(system);
	});
var terezka$line_charts$LineChart$Coordinate$toDataX = F2(
	function (system, value) {
		return system.x.min + A2(terezka$line_charts$LineChart$Coordinate$scaleDataX, system, value - system.frame.margin.left);
	});
var terezka$line_charts$LineChart$Coordinate$scaleDataY = F2(
	function (system, value) {
		return (value * terezka$line_charts$Internal$Coordinate$reachY(system)) / terezka$line_charts$Internal$Coordinate$lengthY(system);
	});
var terezka$line_charts$LineChart$Coordinate$toDataY = F2(
	function (system, value) {
		return system.y.max - A2(terezka$line_charts$LineChart$Coordinate$scaleDataY, system, value - system.frame.margin.top);
	});
var terezka$line_charts$LineChart$Coordinate$toData = F2(
	function (system, point) {
		return {
			x: A2(terezka$line_charts$LineChart$Coordinate$toDataX, system, point.x),
			y: A2(terezka$line_charts$LineChart$Coordinate$toDataY, system, point.y)
		};
	});
var terezka$line_charts$Internal$Legends$viewSample = F4(
	function (_n0, sampleWidth, line, data) {
		var system = _n0.system;
		var lineConfig = _n0.lineConfig;
		var dotsConfig = _n0.dotsConfig;
		var area = _n0.area;
		var shape = terezka$line_charts$Internal$Line$shape(line);
		var dotPosition = A2(
			terezka$line_charts$LineChart$Coordinate$toData,
			system,
			A2(terezka$line_charts$Internal$Data$Point, sampleWidth / 2, 0));
		var color = A3(terezka$line_charts$Internal$Line$color, lineConfig, line, data);
		return A2(
			elm$svg$Svg$g,
			_List_fromArray(
				[
					elm$svg$Svg$Attributes$class('chart__sample')
				]),
			_List_fromArray(
				[
					A5(terezka$line_charts$Internal$Line$viewSample, lineConfig, line, area, data, sampleWidth),
					A6(terezka$line_charts$Internal$Dots$viewSample, dotsConfig, shape, color, system, data, dotPosition)
				]));
	});
var terezka$line_charts$Internal$Legends$viewGrouped = F3(
	function (_arguments, sampleWidth, container) {
		var toLegend = F2(
			function (line, data) {
				return {
					label: terezka$line_charts$Internal$Line$label(line),
					sample: A4(terezka$line_charts$Internal$Legends$viewSample, _arguments, sampleWidth, line, data)
				};
			});
		var legends = A3(elm$core$List$map2, toLegend, _arguments.lines, _arguments.data);
		return A2(container, _arguments.system, legends);
	});
var terezka$line_charts$Internal$Legends$view = function (_arguments) {
	var _n0 = _arguments.legends;
	switch (_n0.$) {
		case 'Free':
			var placement = _n0.a;
			var view_ = _n0.b;
			return A3(terezka$line_charts$Internal$Legends$viewFrees, _arguments, placement, view_);
		case 'Grouped':
			var sampleWidth = _n0.a;
			var container = _n0.b;
			return A3(
				terezka$line_charts$Internal$Legends$viewGrouped,
				_arguments,
				sampleWidth,
				container(_arguments));
		default:
			return elm$svg$Svg$text('');
	}
};
var terezka$line_charts$Internal$Line$data = function (_n0) {
	var config = _n0.a;
	return config.data;
};
var terezka$line_charts$Internal$Area$opacityContainer = function (config) {
	switch (config.$) {
		case 'None':
			return 1;
		case 'Normal':
			var opacity_ = config.a;
			return 1;
		case 'Stacked':
			var opacity_ = config.a;
			return opacity_;
		default:
			var opacity_ = config.a;
			return opacity_;
	}
};
var terezka$line_charts$Internal$Line$viewNormal = function (_n0) {
	var areas = _n0.a;
	var lines = _n0.b;
	var dots = _n0.c;
	var view_ = F3(
		function (area_, line_, dots_) {
			return A2(
				elm$svg$Svg$g,
				_List_fromArray(
					[
						elm$svg$Svg$Attributes$class('chart__line')
					]),
				_List_fromArray(
					[area_, line_, dots_]));
		});
	return A4(elm$core$List$map3, view_, areas, lines, dots);
};
var elm$core$Basics$clamp = F3(
	function (low, high, number) {
		return (_Utils_cmp(number, low) < 0) ? low : ((_Utils_cmp(number, high) > 0) ? high : number);
	});
var terezka$line_charts$Internal$Data$isWithinRange = F2(
	function (system, point) {
		return _Utils_eq(
			A3(elm$core$Basics$clamp, system.x.min, system.x.max, point.x),
			point.x) && _Utils_eq(
			A3(elm$core$Basics$clamp, system.y.min, system.y.max, point.y),
			point.y);
	});
var elm$core$Tuple$mapFirst = F2(
	function (func, _n0) {
		var x = _n0.a;
		var y = _n0.b;
		return _Utils_Tuple2(
			func(x),
			y);
	});
var terezka$line_charts$Internal$Interpolation$linear = elm$core$List$map(
	elm$core$List$map(terezka$line_charts$Internal$Path$Line));
var terezka$line_charts$Internal$Interpolation$First = {$: 'First'};
var terezka$line_charts$Internal$Interpolation$Previous = function (a) {
	return {$: 'Previous', a: a};
};
var terezka$line_charts$Internal$Interpolation$monotoneCurve = F4(
	function (point0, point1, tangent0, tangent1) {
		var dx = (point1.x - point0.x) / 3;
		return A3(
			terezka$line_charts$Internal$Path$CubicBeziers,
			{x: point0.x + dx, y: point0.y + (dx * tangent0)},
			{x: point1.x - dx, y: point1.y - (dx * tangent1)},
			point1);
	});
var terezka$line_charts$Internal$Interpolation$slope2 = F3(
	function (point0, point1, t) {
		var h = point1.x - point0.x;
		return h ? ((((3 * (point1.y - point0.y)) / h) - t) / 2) : t;
	});
var elm$core$Basics$isNaN = _Basics_isNaN;
var terezka$line_charts$Internal$Interpolation$sign = function (x) {
	return (x < 0) ? (-1) : 1;
};
var terezka$line_charts$Internal$Interpolation$toH = F2(
	function (h0, h1) {
		return (!h0) ? ((h1 < 0) ? (0 * (-1)) : h1) : h0;
	});
var terezka$line_charts$Internal$Interpolation$slope3 = F3(
	function (point0, point1, point2) {
		var h1 = point2.x - point1.x;
		var h0 = point1.x - point0.x;
		var s0h = A2(terezka$line_charts$Internal$Interpolation$toH, h0, h1);
		var s0 = (point1.y - point0.y) / s0h;
		var s1h = A2(terezka$line_charts$Internal$Interpolation$toH, h1, h0);
		var s1 = (point2.y - point1.y) / s1h;
		var p = ((s0 * h1) + (s1 * h0)) / (h0 + h1);
		var slope = (terezka$line_charts$Internal$Interpolation$sign(s0) + terezka$line_charts$Internal$Interpolation$sign(s1)) * A2(
			elm$core$Basics$min,
			A2(
				elm$core$Basics$min,
				elm$core$Basics$abs(s0),
				elm$core$Basics$abs(s1)),
			0.5 * elm$core$Basics$abs(p));
		return elm$core$Basics$isNaN(slope) ? 0 : slope;
	});
var terezka$line_charts$Internal$Interpolation$monotonePart = F2(
	function (points, _n0) {
		var tangent = _n0.a;
		var commands = _n0.b;
		var _n1 = _Utils_Tuple2(tangent, points);
		_n1$4:
		while (true) {
			if (_n1.a.$ === 'First') {
				if (_n1.b.b && _n1.b.b.b) {
					if (_n1.b.b.b.b) {
						var _n2 = _n1.a;
						var _n3 = _n1.b;
						var p0 = _n3.a;
						var _n4 = _n3.b;
						var p1 = _n4.a;
						var _n5 = _n4.b;
						var p2 = _n5.a;
						var rest = _n5.b;
						var t1 = A3(terezka$line_charts$Internal$Interpolation$slope3, p0, p1, p2);
						var t0 = A3(terezka$line_charts$Internal$Interpolation$slope2, p0, p1, t1);
						return A2(
							terezka$line_charts$Internal$Interpolation$monotonePart,
							A2(
								elm$core$List$cons,
								p1,
								A2(elm$core$List$cons, p2, rest)),
							_Utils_Tuple2(
								terezka$line_charts$Internal$Interpolation$Previous(t1),
								_Utils_ap(
									commands,
									_List_fromArray(
										[
											A4(terezka$line_charts$Internal$Interpolation$monotoneCurve, p0, p1, t0, t1)
										]))));
					} else {
						var _n9 = _n1.a;
						var _n10 = _n1.b;
						var p0 = _n10.a;
						var _n11 = _n10.b;
						var p1 = _n11.a;
						var t1 = A3(terezka$line_charts$Internal$Interpolation$slope3, p0, p1, p1);
						return _Utils_Tuple2(
							terezka$line_charts$Internal$Interpolation$Previous(t1),
							_Utils_ap(
								commands,
								_List_fromArray(
									[
										A4(terezka$line_charts$Internal$Interpolation$monotoneCurve, p0, p1, t1, t1),
										terezka$line_charts$Internal$Path$Line(p1)
									])));
					}
				} else {
					break _n1$4;
				}
			} else {
				if (_n1.b.b && _n1.b.b.b) {
					if (_n1.b.b.b.b) {
						var t0 = _n1.a.a;
						var _n6 = _n1.b;
						var p0 = _n6.a;
						var _n7 = _n6.b;
						var p1 = _n7.a;
						var _n8 = _n7.b;
						var p2 = _n8.a;
						var rest = _n8.b;
						var t1 = A3(terezka$line_charts$Internal$Interpolation$slope3, p0, p1, p2);
						return A2(
							terezka$line_charts$Internal$Interpolation$monotonePart,
							A2(
								elm$core$List$cons,
								p1,
								A2(elm$core$List$cons, p2, rest)),
							_Utils_Tuple2(
								terezka$line_charts$Internal$Interpolation$Previous(t1),
								_Utils_ap(
									commands,
									_List_fromArray(
										[
											A4(terezka$line_charts$Internal$Interpolation$monotoneCurve, p0, p1, t0, t1)
										]))));
					} else {
						var t0 = _n1.a.a;
						var _n12 = _n1.b;
						var p0 = _n12.a;
						var _n13 = _n12.b;
						var p1 = _n13.a;
						var t1 = A3(terezka$line_charts$Internal$Interpolation$slope3, p0, p1, p1);
						return _Utils_Tuple2(
							terezka$line_charts$Internal$Interpolation$Previous(t1),
							_Utils_ap(
								commands,
								_List_fromArray(
									[
										A4(terezka$line_charts$Internal$Interpolation$monotoneCurve, p0, p1, t0, t1),
										terezka$line_charts$Internal$Path$Line(p1)
									])));
					}
				} else {
					break _n1$4;
				}
			}
		}
		return _Utils_Tuple2(tangent, commands);
	});
var terezka$line_charts$Internal$Interpolation$monotoneSection = F2(
	function (points, _n0) {
		var tangent = _n0.a;
		var acc = _n0.b;
		var _n1 = function () {
			if (points.b) {
				var p0 = points.a;
				var rest = points.b;
				return A2(
					terezka$line_charts$Internal$Interpolation$monotonePart,
					A2(elm$core$List$cons, p0, rest),
					_Utils_Tuple2(
						tangent,
						_List_fromArray(
							[
								terezka$line_charts$Internal$Path$Line(p0)
							])));
			} else {
				return _Utils_Tuple2(tangent, _List_Nil);
			}
		}();
		var t0 = _n1.a;
		var commands = _n1.b;
		return _Utils_Tuple2(
			t0,
			A2(elm$core$List$cons, commands, acc));
	});
var terezka$line_charts$Internal$Interpolation$monotone = function (sections) {
	return A3(
		elm$core$List$foldr,
		terezka$line_charts$Internal$Interpolation$monotoneSection,
		_Utils_Tuple2(terezka$line_charts$Internal$Interpolation$First, _List_Nil),
		sections).b;
};
var terezka$line_charts$Internal$Interpolation$after = F2(
	function (a, b) {
		return _List_fromArray(
			[
				a,
				A2(terezka$line_charts$Internal$Data$Point, b.x, a.y),
				b
			]);
	});
var terezka$line_charts$Internal$Interpolation$stepped = function (sections) {
	var expand = F2(
		function (result, section) {
			expand:
			while (true) {
				if (section.a.b) {
					if (section.a.b.b) {
						var _n1 = section.a;
						var a = _n1.a;
						var _n2 = _n1.b;
						var b = _n2.a;
						var rest = _n2.b;
						var broken = section.b;
						var $temp$result = _Utils_ap(
							result,
							A2(terezka$line_charts$Internal$Interpolation$after, a, b)),
							$temp$section = _Utils_Tuple2(
							A2(elm$core$List$cons, b, rest),
							broken);
						result = $temp$result;
						section = $temp$section;
						continue expand;
					} else {
						if (section.b.$ === 'Just') {
							var _n3 = section.a;
							var last = _n3.a;
							var broken = section.b.a;
							return _Utils_ap(
								result,
								_List_fromArray(
									[
										A2(terezka$line_charts$Internal$Data$Point, broken.x, last.y)
									]));
						} else {
							var _n4 = section.a;
							var last = _n4.a;
							var _n5 = section.b;
							return result;
						}
					}
				} else {
					return result;
				}
			}
		});
	return A2(
		elm$core$List$map,
		A2(
			elm$core$Basics$composeR,
			expand(_List_Nil),
			elm$core$List$map(terezka$line_charts$Internal$Path$Line)),
		sections);
};
var terezka$line_charts$Internal$Interpolation$toCommands = F2(
	function (interpolation, data) {
		var pointsSections = elm$core$List$map(
			A2(
				elm$core$Basics$composeR,
				elm$core$Tuple$mapFirst(
					elm$core$List$map(
						function ($) {
							return $.point;
						})),
				elm$core$Tuple$mapSecond(
					elm$core$Maybe$map(
						function ($) {
							return $.point;
						}))));
		var points = elm$core$List$map(
			A2(
				elm$core$Basics$composeR,
				elm$core$Tuple$first,
				elm$core$List$map(
					function ($) {
						return $.point;
					})));
		switch (interpolation.$) {
			case 'Linear':
				return terezka$line_charts$Internal$Interpolation$linear(
					points(data));
			case 'Monotone':
				return terezka$line_charts$Internal$Interpolation$monotone(
					points(data));
			default:
				return terezka$line_charts$Internal$Interpolation$stepped(
					pointsSections(data));
		}
	});
var terezka$line_charts$Internal$Area$opacitySingle = function (config) {
	switch (config.$) {
		case 'None':
			return 0;
		case 'Normal':
			var opacity_ = config.a;
			return opacity_;
		case 'Stacked':
			var opacity_ = config.a;
			return 1;
		default:
			var opacity_ = config.a;
			return 1;
	}
};
var terezka$line_charts$Internal$Path$toPoint = function (command) {
	switch (command.$) {
		case 'Close':
			return A2(terezka$line_charts$LineChart$Coordinate$Point, 0, 0);
		case 'Move':
			var p = command.a;
			return p;
		case 'Line':
			var p = command.a;
			return p;
		case 'Horizontal':
			var x = command.a;
			return A2(terezka$line_charts$LineChart$Coordinate$Point, x, 0);
		case 'Vertical':
			var y = command.a;
			return A2(terezka$line_charts$LineChart$Coordinate$Point, 0, y);
		case 'CubicBeziers':
			var c1 = command.a;
			var c2 = command.b;
			var p = command.c;
			return p;
		case 'CubicBeziersShort':
			var c1 = command.a;
			var p = command.b;
			return p;
		case 'QuadraticBeziers':
			var c1 = command.a;
			var p = command.b;
			return p;
		case 'QuadraticBeziersShort':
			var p = command.a;
			return p;
		default:
			var rx = command.a;
			var ry = command.b;
			var xAxisRotation = command.c;
			var largeArcFlag = command.d;
			var sweepFlag = command.e;
			var p = command.f;
			return p;
	}
};
var terezka$line_charts$Internal$Utils$towardsZero = function (_n0) {
	var max = _n0.max;
	var min = _n0.min;
	return A3(elm$core$Basics$clamp, min, max, 0);
};
var terezka$line_charts$Internal$Utils$last = function (list) {
	return elm$core$List$head(
		A2(
			elm$core$List$drop,
			elm$core$List$length(list) - 1,
			list));
};
var terezka$line_charts$Internal$Utils$lastSafe = F2(
	function (first, rest) {
		return A2(
			elm$core$Maybe$withDefault,
			first,
			terezka$line_charts$Internal$Utils$last(rest));
	});
var terezka$line_charts$Internal$Utils$viewWithEdges = F2(
	function (stuff, view) {
		if (stuff.b) {
			var first = stuff.a;
			var rest = stuff.b;
			return A3(
				view,
				first,
				rest,
				A2(terezka$line_charts$Internal$Utils$lastSafe, first, rest));
		} else {
			return elm$svg$Svg$text('');
		}
	});
var terezka$line_charts$LineChart$Junk$withinChartArea = terezka$line_charts$Internal$Svg$withinChartArea;
var terezka$line_charts$Internal$Line$viewArea = F5(
	function (_n0, line_, style_, interpolation, data_) {
		var system = _n0.system;
		var lineConfig = _n0.lineConfig;
		var area = _n0.area;
		var ground = function (point) {
			return A2(
				terezka$line_charts$Internal$Data$Point,
				point.x,
				terezka$line_charts$Internal$Utils$towardsZero(system.y));
		};
		var commands = F3(
			function (first, middle, last) {
				return A3(
					terezka$line_charts$Internal$Utils$concat,
					_List_fromArray(
						[
							terezka$line_charts$Internal$Path$Move(
							ground(
								terezka$line_charts$Internal$Path$toPoint(first))),
							terezka$line_charts$Internal$Path$Line(
							terezka$line_charts$Internal$Path$toPoint(first))
						]),
					interpolation,
					_List_fromArray(
						[
							terezka$line_charts$Internal$Path$Line(
							ground(
								terezka$line_charts$Internal$Path$toPoint(last)))
						]));
			});
		var attributes = A2(
			elm$core$List$cons,
			terezka$line_charts$LineChart$Junk$withinChartArea(system),
			A2(
				elm$core$List$cons,
				elm$svg$Svg$Attributes$fillOpacity(
					elm$core$String$fromFloat(
						terezka$line_charts$Internal$Area$opacitySingle(area))),
				A3(terezka$line_charts$Internal$Line$toAreaAttributes, line_, style_, area)));
		return A2(
			terezka$line_charts$Internal$Utils$viewWithEdges,
			interpolation,
			F3(
				function (first, middle, last) {
					return A3(
						terezka$line_charts$Internal$Path$view,
						system,
						attributes,
						A3(commands, first, middle, last));
				}));
	});
var terezka$line_charts$Internal$Dots$view = F2(
	function (_n0, data) {
		var system = _n0.system;
		var dotsConfig = _n0.dotsConfig;
		var shape = _n0.shape;
		var color = _n0.color;
		var _n1 = dotsConfig;
		var config = _n1.a;
		var _n2 = config.individual(data.user);
		var style_ = _n2.a;
		return A5(terezka$line_charts$Internal$Dots$viewShape, system, style_, shape, color, data.point);
	});
var terezka$line_charts$Internal$Line$viewDot = F3(
	function (_arguments, _n0, _n1) {
		var lineConfig = _n0.a;
		var style_ = _n1.a;
		return terezka$line_charts$Internal$Dots$view(
			{
				color: style_.color(lineConfig.color),
				dotsConfig: _arguments.dotsConfig,
				shape: lineConfig.shape,
				system: _arguments.system
			});
	});
var terezka$line_charts$Internal$Utils$viewWithFirst = F2(
	function (stuff, view) {
		if (stuff.b) {
			var first = stuff.a;
			var rest = stuff.b;
			return A2(view, first, rest);
		} else {
			return elm$svg$Svg$text('');
		}
	});
var terezka$line_charts$Internal$Line$viewSeries = F5(
	function (_n0, line_, style_, interpolation, data_) {
		var system = _n0.system;
		var lineConfig = _n0.lineConfig;
		var attributes = A2(
			elm$core$List$cons,
			terezka$line_charts$LineChart$Junk$withinChartArea(system),
			A2(terezka$line_charts$Internal$Line$toSeriesAttributes, line_, style_));
		return A2(
			terezka$line_charts$Internal$Utils$viewWithFirst,
			data_,
			F2(
				function (first, _n1) {
					return A3(
						terezka$line_charts$Internal$Path$view,
						system,
						attributes,
						A2(
							elm$core$List$cons,
							terezka$line_charts$Internal$Path$Move(first.point),
							interpolation));
				}));
	});
var terezka$line_charts$Internal$Utils$part = F4(
	function (isReal, points, current, parts) {
		part:
		while (true) {
			if (points.b) {
				var first = points.a;
				var rest = points.b;
				if (isReal(first)) {
					var $temp$isReal = isReal,
						$temp$points = rest,
						$temp$current = _Utils_ap(
						current,
						_List_fromArray(
							[first])),
						$temp$parts = parts;
					isReal = $temp$isReal;
					points = $temp$points;
					current = $temp$current;
					parts = $temp$parts;
					continue part;
				} else {
					var $temp$isReal = isReal,
						$temp$points = rest,
						$temp$current = _List_Nil,
						$temp$parts = A2(
						elm$core$List$cons,
						_Utils_Tuple2(
							current,
							elm$core$Maybe$Just(first)),
						parts);
					isReal = $temp$isReal;
					points = $temp$points;
					current = $temp$current;
					parts = $temp$parts;
					continue part;
				}
			} else {
				return A2(
					elm$core$List$cons,
					_Utils_Tuple2(current, elm$core$Maybe$Nothing),
					parts);
			}
		}
	});
var terezka$line_charts$Internal$Line$viewSingle = F3(
	function (_arguments, line_, data_) {
		var style_ = function (_n1) {
			var look = _n1.a;
			return look(
				A2(
					elm$core$List$map,
					function ($) {
						return $.user;
					},
					data_));
		}(_arguments.lineConfig);
		var sections = A4(
			terezka$line_charts$Internal$Utils$part,
			function ($) {
				return $.isReal;
			},
			data_,
			_List_Nil,
			_List_Nil);
		var parts = A2(elm$core$List$map, elm$core$Tuple$first, sections);
		var viewDots = A2(
			elm$svg$Svg$g,
			_List_fromArray(
				[
					elm$svg$Svg$Attributes$class('chart__dots')
				]),
			A2(
				elm$core$List$map,
				A3(terezka$line_charts$Internal$Line$viewDot, _arguments, line_, style_),
				A2(
					elm$core$List$filter,
					A2(
						elm$core$Basics$composeL,
						terezka$line_charts$Internal$Data$isWithinRange(_arguments.system),
						function ($) {
							return $.point;
						}),
					elm$core$List$concat(parts))));
		var commands = A2(terezka$line_charts$Internal$Interpolation$toCommands, _arguments.interpolation, sections);
		var viewAreas = function (_n0) {
			return A2(
				elm$svg$Svg$g,
				_List_fromArray(
					[
						elm$svg$Svg$Attributes$class('chart__interpolation__area')
					]),
				A3(
					elm$core$List$map2,
					A3(terezka$line_charts$Internal$Line$viewArea, _arguments, line_, style_),
					commands,
					parts));
		};
		var viewSeriess = A2(
			elm$svg$Svg$g,
			_List_fromArray(
				[
					elm$svg$Svg$Attributes$class('chart__interpolation__line')
				]),
			A3(
				elm$core$List$map2,
				A3(terezka$line_charts$Internal$Line$viewSeries, _arguments, line_, style_),
				commands,
				parts));
		return _Utils_Tuple3(
			A2(
				terezka$line_charts$Internal$Utils$viewIf,
				terezka$line_charts$Internal$Area$hasArea(_arguments.area),
				viewAreas),
			viewSeriess,
			viewDots);
	});
var terezka$line_charts$Internal$Line$viewStacked = F2(
	function (area, _n0) {
		var areas = _n0.a;
		var lines = _n0.b;
		var dots = _n0.c;
		var toList = F2(
			function (l, d) {
				return _List_fromArray(
					[l, d]);
			});
		var opacity = 'opacity: ' + elm$core$String$fromFloat(
			terezka$line_charts$Internal$Area$opacityContainer(area));
		var bottoms = elm$core$List$concat(
			A3(elm$core$List$map2, toList, lines, dots));
		return _List_fromArray(
			[
				A2(
				elm$svg$Svg$g,
				_List_fromArray(
					[
						elm$svg$Svg$Attributes$class('chart__bottoms'),
						elm$svg$Svg$Attributes$style(opacity)
					]),
				areas),
				A2(
				elm$svg$Svg$g,
				_List_fromArray(
					[
						elm$svg$Svg$Attributes$class('chart__tops')
					]),
				bottoms)
			]);
	});
var terezka$line_charts$Internal$Utils$unzip3 = function (pairs) {
	var step = F2(
		function (_n0, _n1) {
			var a = _n0.a;
			var b = _n0.b;
			var c = _n0.c;
			var aas = _n1.a;
			var bs = _n1.b;
			var cs = _n1.c;
			return _Utils_Tuple3(
				A2(elm$core$List$cons, a, aas),
				A2(elm$core$List$cons, b, bs),
				A2(elm$core$List$cons, c, cs));
		});
	return A3(
		elm$core$List$foldr,
		step,
		_Utils_Tuple3(_List_Nil, _List_Nil, _List_Nil),
		pairs);
};
var terezka$line_charts$Internal$Line$view = F3(
	function (_arguments, lines, datas) {
		var container = elm$svg$Svg$g(
			_List_fromArray(
				[
					elm$svg$Svg$Attributes$class('chart__lines')
				]));
		var buildSeriesViews = (terezka$line_charts$Internal$Area$opacityContainer(_arguments.area) < 1) ? terezka$line_charts$Internal$Line$viewStacked(_arguments.area) : terezka$line_charts$Internal$Line$viewNormal;
		return container(
			buildSeriesViews(
				terezka$line_charts$Internal$Utils$unzip3(
					A3(
						elm$core$List$map2,
						terezka$line_charts$Internal$Line$viewSingle(_arguments),
						lines,
						datas))));
	});
var terezka$line_charts$Internal$Events$toChartAttributes = F3(
	function (data, system, _n0) {
		var events = _n0.a;
		var order = function (_n1) {
			var outside = _n1.a;
			var event = _n1.b;
			return outside ? elm$core$Maybe$Nothing : elm$core$Maybe$Just(
				A2(event, data, system));
		};
		return A2(elm$core$List$filterMap, order, events);
	});
var terezka$line_charts$LineChart$chartAreaAttributes = function (system) {
	return _List_fromArray(
		[
			elm$svg$Svg$Attributes$x(
			elm$core$String$fromFloat(system.frame.margin.left)),
			elm$svg$Svg$Attributes$y(
			elm$core$String$fromFloat(system.frame.margin.top)),
			elm$svg$Svg$Attributes$width(
			elm$core$String$fromFloat(
				terezka$line_charts$Internal$Coordinate$lengthX(system))),
			elm$svg$Svg$Attributes$height(
			elm$core$String$fromFloat(
				terezka$line_charts$Internal$Coordinate$lengthY(system)))
		]);
};
var terezka$line_charts$LineChart$chartAreaPlatform = F3(
	function (config, data, system) {
		var attributes = elm$core$List$concat(
			_List_fromArray(
				[
					_List_fromArray(
					[
						elm$svg$Svg$Attributes$fill('transparent')
					]),
					terezka$line_charts$LineChart$chartAreaAttributes(system),
					A3(terezka$line_charts$Internal$Events$toChartAttributes, data, system, config.events)
				]));
		return A2(elm$svg$Svg$rect, attributes, _List_Nil);
	});
var elm$svg$Svg$clipPath = elm$svg$Svg$trustedNode('clipPath');
var elm$svg$Svg$Attributes$id = _VirtualDom_attribute('id');
var terezka$line_charts$LineChart$clipPath = function (system) {
	return A2(
		elm$svg$Svg$clipPath,
		_List_fromArray(
			[
				elm$svg$Svg$Attributes$id(
				terezka$line_charts$Internal$Utils$toChartAreaId(system.id))
			]),
		_List_fromArray(
			[
				A2(
				elm$svg$Svg$rect,
				terezka$line_charts$LineChart$chartAreaAttributes(system),
				_List_Nil)
			]));
};
var terezka$line_charts$Internal$Container$sizeStyles = F3(
	function (_n0, width, height) {
		var properties_ = _n0.a;
		var _n1 = properties_.size;
		if (_n1.$ === 'Static') {
			return _List_fromArray(
				[
					A2(
					elm$html$Html$Attributes$style,
					'height',
					elm$core$String$fromFloat(height) + 'px'),
					A2(
					elm$html$Html$Attributes$style,
					'width',
					elm$core$String$fromFloat(width) + 'px')
				]);
		} else {
			return _List_Nil;
		}
	});
var terezka$line_charts$LineChart$container = F4(
	function (config, _n0, junkHtml, plot) {
		var frame = _n0.frame;
		var userAttributes = A2(
			terezka$line_charts$Internal$Container$properties,
			function ($) {
				return $.attributesHtml;
			},
			config.container);
		var sizeStyles = A3(terezka$line_charts$Internal$Container$sizeStyles, config.container, frame.size.width, frame.size.height);
		var styles = A2(
			elm$core$List$cons,
			A2(elm$html$Html$Attributes$style, 'position', 'relative'),
			sizeStyles);
		return A2(
			elm$html$Html$div,
			_Utils_ap(styles, userAttributes),
			A2(elm$core$List$cons, plot, junkHtml));
	});
var terezka$line_charts$Internal$Data$Data = F3(
	function (user, point, isReal) {
		return {isReal: isReal, point: point, user: user};
	});
var terezka$line_charts$LineChart$setY = F2(
	function (datum, y) {
		return A3(
			terezka$line_charts$Internal$Data$Data,
			datum.user,
			A2(terezka$line_charts$Internal$Data$Point, datum.point.x, y),
			datum.isReal);
	});
var terezka$line_charts$LineChart$normalize = function (datasets) {
	if (datasets.b) {
		var highest = datasets.a;
		var belows = datasets.b;
		var toPercentage = F2(
			function (highest_, datum) {
				return A2(terezka$line_charts$LineChart$setY, datum, (100 * datum.point.y) / highest_.point.y);
			});
		return A2(
			elm$core$List$map,
			A2(elm$core$List$map2, toPercentage, highest),
			A2(elm$core$List$cons, highest, belows));
	} else {
		return datasets;
	}
};
var terezka$line_charts$Internal$Utils$withFirst = F2(
	function (stuff, process) {
		if (stuff.b) {
			var first = stuff.a;
			var rest = stuff.b;
			return elm$core$Maybe$Just(
				A2(process, first, rest));
		} else {
			return elm$core$Maybe$Nothing;
		}
	});
var terezka$line_charts$LineChart$addBelows = F2(
	function (alldata, dataBelowAll) {
		var add = F2(
			function (below, datum) {
				return A2(terezka$line_charts$LineChart$setY, below, below.point.y + datum.point.y);
			});
		var iterate = F4(
			function (datum0, dataTop, dataBelowTop, result) {
				iterate:
				while (true) {
					var _n0 = _Utils_Tuple2(dataTop, dataBelowTop);
					if (_n0.a.b) {
						if (_n0.b.b) {
							var _n1 = _n0.a;
							var datum1 = _n1.a;
							var data = _n1.b;
							var _n2 = _n0.b;
							var datumBelow = _n2.a;
							var dataBelow = _n2.b;
							if (_Utils_cmp(datum1.point.x, datumBelow.point.x) > 0) {
								if (datumBelow.isReal) {
									var $temp$datum0 = datum0,
										$temp$dataTop = A2(elm$core$List$cons, datum1, data),
										$temp$dataBelowTop = dataBelow,
										$temp$result = A2(
										elm$core$List$cons,
										A2(add, datumBelow, datum0),
										result);
									datum0 = $temp$datum0;
									dataTop = $temp$dataTop;
									dataBelowTop = $temp$dataBelowTop;
									result = $temp$result;
									continue iterate;
								} else {
									var breakdata = _Utils_update(
										datum0,
										{isReal: false});
									var $temp$datum0 = datum0,
										$temp$dataTop = A2(elm$core$List$cons, datum1, data),
										$temp$dataBelowTop = dataBelow,
										$temp$result = A2(
										elm$core$List$cons,
										A2(add, datumBelow, datum0),
										result);
									datum0 = $temp$datum0;
									dataTop = $temp$dataTop;
									dataBelowTop = $temp$dataBelowTop;
									result = $temp$result;
									continue iterate;
								}
							} else {
								var $temp$datum0 = datum1,
									$temp$dataTop = data,
									$temp$dataBelowTop = A2(elm$core$List$cons, datumBelow, dataBelow),
									$temp$result = result;
								datum0 = $temp$datum0;
								dataTop = $temp$dataTop;
								dataBelowTop = $temp$dataBelowTop;
								result = $temp$result;
								continue iterate;
							}
						} else {
							var _n4 = _n0.a;
							var datum1 = _n4.a;
							var data = _n4.b;
							return result;
						}
					} else {
						if (_n0.b.b) {
							var _n3 = _n0.b;
							var datumBelow = _n3.a;
							var dataBelow = _n3.b;
							if (_Utils_cmp(datum0.point.x, datumBelow.point.x) < 1) {
								var $temp$datum0 = datum0,
									$temp$dataTop = _List_Nil,
									$temp$dataBelowTop = dataBelow,
									$temp$result = A2(
									elm$core$List$cons,
									A2(add, datumBelow, datum0),
									result);
								datum0 = $temp$datum0;
								dataTop = $temp$dataTop;
								dataBelowTop = $temp$dataBelowTop;
								result = $temp$result;
								continue iterate;
							} else {
								var $temp$datum0 = datum0,
									$temp$dataTop = _List_Nil,
									$temp$dataBelowTop = dataBelow,
									$temp$result = A2(elm$core$List$cons, datumBelow, result);
								datum0 = $temp$datum0;
								dataTop = $temp$dataTop;
								dataBelowTop = $temp$dataBelowTop;
								result = $temp$result;
								continue iterate;
							}
						} else {
							return result;
						}
					}
				}
			});
		return elm$core$List$reverse(
			A2(
				elm$core$Maybe$withDefault,
				_List_Nil,
				A2(
					terezka$line_charts$Internal$Utils$withFirst,
					alldata,
					F2(
						function (first, rest) {
							return A4(iterate, first, rest, dataBelowAll, _List_Nil);
						}))));
	});
var terezka$line_charts$LineChart$stack = function (dataset) {
	var stackBelows = F2(
		function (dataset_, result) {
			if (dataset_.b) {
				var data = dataset_.a;
				var belows = dataset_.b;
				return A2(
					stackBelows,
					belows,
					A2(
						elm$core$List$cons,
						A3(elm$core$List$foldl, terezka$line_charts$LineChart$addBelows, data, belows),
						result));
			} else {
				return result;
			}
		});
	return elm$core$List$reverse(
		A2(stackBelows, dataset, _List_Nil));
};
var terezka$line_charts$LineChart$toDataPoints = F2(
	function (config, lines) {
		var y = terezka$line_charts$Internal$Axis$variable(config.y);
		var x = terezka$line_charts$Internal$Axis$variable(config.x);
		var addPoint = function (datum) {
			var _n1 = _Utils_Tuple2(
				x(datum),
				y(datum));
			if (_n1.a.$ === 'Just') {
				if (_n1.b.$ === 'Just') {
					var x_ = _n1.a.a;
					var y_ = _n1.b.a;
					return elm$core$Maybe$Just(
						A3(
							terezka$line_charts$Internal$Data$Data,
							datum,
							A2(terezka$line_charts$Internal$Data$Point, x_, y_),
							true));
				} else {
					var x_ = _n1.a.a;
					var _n2 = _n1.b;
					return elm$core$Maybe$Just(
						A3(
							terezka$line_charts$Internal$Data$Data,
							datum,
							A2(terezka$line_charts$Internal$Data$Point, x_, 0),
							false));
				}
			} else {
				if (_n1.b.$ === 'Just') {
					var _n3 = _n1.a;
					var y_ = _n1.b.a;
					return elm$core$Maybe$Nothing;
				} else {
					var _n4 = _n1.a;
					var _n5 = _n1.b;
					return elm$core$Maybe$Nothing;
				}
			}
		};
		var data = A2(
			elm$core$List$map,
			A2(
				elm$core$Basics$composeR,
				terezka$line_charts$Internal$Line$data,
				elm$core$List$filterMap(addPoint)),
			lines);
		var _n0 = config.area;
		switch (_n0.$) {
			case 'None':
				return data;
			case 'Normal':
				return data;
			case 'Stacked':
				return terezka$line_charts$LineChart$stack(data);
			default:
				return terezka$line_charts$LineChart$normalize(
					terezka$line_charts$LineChart$stack(data));
		}
	});
var terezka$line_charts$Internal$Axis$pixels = function (_n0) {
	var config = _n0.a;
	return config.pixels;
};
var terezka$line_charts$Internal$Axis$range = function (_n0) {
	var config = _n0.a;
	return config.range;
};
var terezka$line_charts$LineChart$Coordinate$Range = F2(
	function (min, max) {
		return {max: max, min: min};
	});
var terezka$line_charts$Internal$Axis$Range$applyX = F2(
	function (range, system) {
		switch (range.$) {
			case 'Padded':
				var padMin = range.a;
				var padMax = range.b;
				var _n1 = system;
				var frame = _n1.frame;
				var _n2 = frame;
				var size = _n2.size;
				var system_ = _Utils_update(
					system,
					{
						frame: _Utils_update(
							frame,
							{
								size: _Utils_update(
									size,
									{
										width: A2(elm$core$Basics$max, 1, (size.width - padMin) - padMax)
									})
							})
					});
				var scale = terezka$line_charts$LineChart$Coordinate$scaleDataX(system_);
				return A2(
					terezka$line_charts$LineChart$Coordinate$Range,
					system.x.min - scale(padMin),
					system.x.max + scale(padMax));
			case 'Window':
				var min = range.a;
				var max = range.b;
				return A2(terezka$line_charts$LineChart$Coordinate$Range, min, max);
			default:
				var toRange = range.a;
				return toRange(system.x);
		}
	});
var terezka$line_charts$Internal$Axis$Range$applyY = F2(
	function (range, system) {
		switch (range.$) {
			case 'Padded':
				var padMin = range.a;
				var padMax = range.b;
				var _n1 = system;
				var frame = _n1.frame;
				var _n2 = frame;
				var size = _n2.size;
				var system_ = _Utils_update(
					system,
					{
						frame: _Utils_update(
							frame,
							{
								size: _Utils_update(
									size,
									{
										height: A2(elm$core$Basics$max, 1, (size.height - padMin) - padMax)
									})
							})
					});
				var scale = terezka$line_charts$LineChart$Coordinate$scaleDataY(system_);
				return A2(
					terezka$line_charts$LineChart$Coordinate$Range,
					system.y.min - scale(padMin),
					system.y.max + scale(padMax));
			case 'Window':
				var min = range.a;
				var max = range.b;
				return A2(terezka$line_charts$LineChart$Coordinate$Range, min, max);
			default:
				var toRange = range.a;
				return toRange(system.y);
		}
	});
var terezka$line_charts$Internal$Coordinate$Frame = F2(
	function (margin, size) {
		return {margin: margin, size: size};
	});
var terezka$line_charts$Internal$Coordinate$Size = F2(
	function (width, height) {
		return {height: height, width: width};
	});
var terezka$line_charts$Internal$Coordinate$ground = function (range_) {
	return _Utils_update(
		range_,
		{
			min: A2(elm$core$Basics$min, range_.min, 0)
		});
};
var terezka$line_charts$Internal$Coordinate$maximum = function (toValue) {
	return A2(
		elm$core$Basics$composeR,
		elm$core$List$map(toValue),
		A2(
			elm$core$Basics$composeR,
			elm$core$List$maximum,
			elm$core$Maybe$withDefault(1)));
};
var terezka$line_charts$Internal$Coordinate$minimum = function (toValue) {
	return A2(
		elm$core$Basics$composeR,
		elm$core$List$map(toValue),
		A2(
			elm$core$Basics$composeR,
			elm$core$List$minimum,
			elm$core$Maybe$withDefault(0)));
};
var terezka$line_charts$Internal$Coordinate$range = F2(
	function (toValue, data) {
		var range_ = {
			max: A2(terezka$line_charts$Internal$Coordinate$maximum, toValue, data),
			min: A2(terezka$line_charts$Internal$Coordinate$minimum, toValue, data)
		};
		return _Utils_eq(range_.min, range_.max) ? _Utils_update(
			range_,
			{max: range_.max + 1}) : range_;
	});
var terezka$line_charts$LineChart$toSystem = F2(
	function (config, data) {
		var yRange = A2(
			terezka$line_charts$Internal$Coordinate$range,
			A2(
				elm$core$Basics$composeR,
				function ($) {
					return $.point;
				},
				function ($) {
					return $.y;
				}),
			data);
		var xRange = A2(
			terezka$line_charts$Internal$Coordinate$range,
			A2(
				elm$core$Basics$composeR,
				function ($) {
					return $.point;
				},
				function ($) {
					return $.x;
				}),
			data);
		var size = A2(
			terezka$line_charts$Internal$Coordinate$Size,
			terezka$line_charts$Internal$Axis$pixels(config.x),
			terezka$line_charts$Internal$Axis$pixels(config.y));
		var hasArea = terezka$line_charts$Internal$Area$hasArea(config.area);
		var container_ = A2(terezka$line_charts$Internal$Container$properties, elm$core$Basics$identity, config.container);
		var frame = A2(terezka$line_charts$Internal$Coordinate$Frame, container_.margin, size);
		var adjustDomainRange = function (domain) {
			return hasArea ? terezka$line_charts$Internal$Coordinate$ground(domain) : domain;
		};
		var system = {
			frame: frame,
			id: container_.id,
			x: xRange,
			xData: xRange,
			y: adjustDomainRange(yRange),
			yData: yRange
		};
		return _Utils_update(
			system,
			{
				x: A2(
					terezka$line_charts$Internal$Axis$Range$applyX,
					terezka$line_charts$Internal$Axis$range(config.x),
					system),
				y: A2(
					terezka$line_charts$Internal$Axis$Range$applyY,
					terezka$line_charts$Internal$Axis$range(config.y),
					system)
			});
	});
var terezka$line_charts$LineChart$viewBoxAttribute = function (_n0) {
	var frame = _n0.frame;
	return elm$svg$Svg$Attributes$viewBox(
		'0 0 ' + (elm$core$String$fromFloat(frame.size.width) + (' ' + elm$core$String$fromFloat(frame.size.height))));
};
var terezka$line_charts$LineChart$viewCustom = F2(
	function (config, lines) {
		var junkLineInfo = function (line_) {
			return _Utils_Tuple3(
				A3(terezka$line_charts$Internal$Line$color, config.line, line_, _List_Nil),
				terezka$line_charts$Internal$Line$label(line_),
				terezka$line_charts$Internal$Line$data(line_));
		};
		var getJunk = A3(
			terezka$line_charts$Internal$Junk$getLayers,
			A2(elm$core$List$map, junkLineInfo, lines),
			terezka$line_charts$Internal$Axis$variable(config.x),
			terezka$line_charts$Internal$Axis$variable(config.y));
		var data = A2(terezka$line_charts$LineChart$toDataPoints, config, lines);
		var dataAll = elm$core$List$concat(data);
		var dataSafe = A2(
			elm$core$List$map,
			elm$core$List$filter(
				function ($) {
					return $.isReal;
				}),
			data);
		var dataAllSafe = elm$core$List$concat(dataSafe);
		var system = A2(terezka$line_charts$LineChart$toSystem, config, dataAllSafe);
		var viewLines = terezka$line_charts$Internal$Line$view(
			{area: config.area, dotsConfig: config.dots, interpolation: config.interpolation, lineConfig: config.line, system: system});
		var viewLegends = terezka$line_charts$Internal$Legends$view(
			{
				area: config.area,
				data: dataSafe,
				dotsConfig: config.dots,
				legends: config.legends,
				lineConfig: config.line,
				lines: lines,
				system: system,
				x: terezka$line_charts$Internal$Axis$variable(config.x),
				y: terezka$line_charts$Internal$Axis$variable(config.y)
			});
		var attributes = elm$core$List$concat(
			_List_fromArray(
				[
					A2(
					terezka$line_charts$Internal$Container$properties,
					function ($) {
						return $.attributesSvg;
					},
					config.container),
					A3(terezka$line_charts$Internal$Events$toContainerAttributes, dataAll, system, config.events),
					_List_fromArray(
					[
						terezka$line_charts$LineChart$viewBoxAttribute(system)
					])
				]));
		var addGrid = terezka$line_charts$Internal$Junk$addBelow(
			A4(terezka$line_charts$Internal$Grid$view, system, config.x, config.y, config.grid));
		var junk = addGrid(
			A2(getJunk, system, config.junk));
		return A4(
			terezka$line_charts$LineChart$container,
			config,
			system,
			junk.html,
			A2(
				elm$svg$Svg$svg,
				attributes,
				_List_fromArray(
					[
						A2(
						elm$svg$Svg$defs,
						_List_Nil,
						_List_fromArray(
							[
								terezka$line_charts$LineChart$clipPath(system)
							])),
						A2(
						elm$svg$Svg$g,
						_List_fromArray(
							[
								elm$svg$Svg$Attributes$class('chart__junk--below')
							]),
						junk.below),
						A2(viewLines, lines, data),
						A3(terezka$line_charts$LineChart$chartAreaPlatform, config, dataAll, system),
						A3(terezka$line_charts$Internal$Axis$viewHorizontal, system, config.intersection, config.x),
						A3(terezka$line_charts$Internal$Axis$viewVertical, system, config.intersection, config.y),
						viewLegends,
						A2(
						elm$svg$Svg$g,
						_List_fromArray(
							[
								elm$svg$Svg$Attributes$class('chart__junk--above')
							]),
						junk.above)
					])));
	});
var terezka$line_charts$Internal$Area$Stacked = function (a) {
	return {$: 'Stacked', a: a};
};
var terezka$line_charts$Internal$Area$stacked = terezka$line_charts$Internal$Area$Stacked;
var terezka$line_charts$LineChart$Area$stacked = terezka$line_charts$Internal$Area$stacked;
var terezka$line_charts$Internal$Axis$Config = function (a) {
	return {$: 'Config', a: a};
};
var terezka$line_charts$Internal$Axis$custom = terezka$line_charts$Internal$Axis$Config;
var terezka$line_charts$Internal$Axis$Line$Config = function (a) {
	return {$: 'Config', a: a};
};
var terezka$line_charts$Internal$Axis$Line$custom = terezka$line_charts$Internal$Axis$Line$Config;
var terezka$line_charts$Internal$Coordinate$smallestRange = F2(
	function (data, range_) {
		return {
			max: A2(elm$core$Basics$min, data.max, range_.max),
			min: A2(elm$core$Basics$max, data.min, range_.min)
		};
	});
var terezka$line_charts$Internal$Axis$Line$rangeFrame = function (color) {
	return terezka$line_charts$Internal$Axis$Line$custom(
		F2(
			function (data, range) {
				var smallest = A2(terezka$line_charts$Internal$Coordinate$smallestRange, data, range);
				return {color: color, end: smallest.max, events: _List_Nil, start: smallest.min, width: 1};
			}));
};
var terezka$line_charts$Internal$Axis$Range$Padded = F2(
	function (a, b) {
		return {$: 'Padded', a: a, b: b};
	});
var terezka$line_charts$Internal$Axis$Range$padded = terezka$line_charts$Internal$Axis$Range$Padded;
var terezka$line_charts$Internal$Axis$Ticks$Config = function (a) {
	return {$: 'Config', a: a};
};
var terezka$line_charts$Internal$Axis$Ticks$custom = terezka$line_charts$Internal$Axis$Ticks$Config;
var terezka$line_charts$Internal$Axis$Title$Config = function (a) {
	return {$: 'Config', a: a};
};
var terezka$line_charts$Internal$Axis$Title$custom = F4(
	function (position, x, y, title) {
		return terezka$line_charts$Internal$Axis$Title$Config(
			{
				offset: _Utils_Tuple2(x, y),
				position: position,
				view: title
			});
	});
var elm$svg$Svg$text_ = elm$svg$Svg$trustedNode('text');
var elm$svg$Svg$tspan = elm$svg$Svg$trustedNode('tspan');
var terezka$line_charts$Internal$Svg$label = F2(
	function (color, string) {
		return A2(
			elm$svg$Svg$text_,
			_List_fromArray(
				[
					elm$svg$Svg$Attributes$fill(color),
					elm$svg$Svg$Attributes$style('pointer-events: none;')
				]),
			_List_fromArray(
				[
					A2(
					elm$svg$Svg$tspan,
					_List_Nil,
					_List_fromArray(
						[
							elm$svg$Svg$text(string)
						]))
				]));
	});
var terezka$line_charts$Internal$Axis$Title$atPosition = F3(
	function (position, x, y) {
		return A2(
			elm$core$Basics$composeL,
			A3(terezka$line_charts$Internal$Axis$Title$custom, position, x, y),
			terezka$line_charts$Internal$Svg$label('inherit'));
	});
var terezka$line_charts$Internal$Axis$Title$atDataMax = function () {
	var position = F2(
		function (data, range) {
			return A2(elm$core$Basics$min, data.max, range.max);
		});
	return terezka$line_charts$Internal$Axis$Title$atPosition(position);
}();
var terezka$line_charts$Internal$Axis$Values$Around = function (a) {
	return {$: 'Around', a: a};
};
var terezka$line_charts$Internal$Axis$Values$around = terezka$line_charts$Internal$Axis$Values$Around;
var terezka$line_charts$Internal$Axis$Values$ceilingTo = F2(
	function (prec, number) {
		return prec * elm$core$Basics$ceiling(number / prec);
	});
var terezka$line_charts$Internal$Axis$Values$getBeginning = F2(
	function (min, interval) {
		var multiple = min / interval;
		return _Utils_eq(
			multiple,
			elm$core$Basics$round(multiple)) ? min : A2(terezka$line_charts$Internal$Axis$Values$ceilingTo, interval, min);
	});
var elm$core$Basics$isInfinite = _Basics_isInfinite;
var elm$core$String$padRight = F3(
	function (n, _char, string) {
		return _Utils_ap(
			string,
			A2(
				elm$core$String$repeat,
				n - elm$core$String$length(string),
				elm$core$String$fromChar(_char)));
	});
var elm$core$String$reverse = _String_reverse;
var elm$core$String$foldr = _String_foldr;
var elm$core$String$toList = function (string) {
	return A3(elm$core$String$foldr, elm$core$List$cons, _List_Nil, string);
};
var myrho$elm_round$Round$addSign = F2(
	function (signed, str) {
		var isNotZero = A2(
			elm$core$List$any,
			function (c) {
				return (!_Utils_eq(
					c,
					_Utils_chr('0'))) && (!_Utils_eq(
					c,
					_Utils_chr('.')));
			},
			elm$core$String$toList(str));
		return _Utils_ap(
			(signed && isNotZero) ? '-' : '',
			str);
	});
var elm$core$Char$fromCode = _Char_fromCode;
var myrho$elm_round$Round$increaseNum = function (_n0) {
	var head = _n0.a;
	var tail = _n0.b;
	if (_Utils_eq(
		head,
		_Utils_chr('9'))) {
		var _n1 = elm$core$String$uncons(tail);
		if (_n1.$ === 'Nothing') {
			return '01';
		} else {
			var headtail = _n1.a;
			return A2(
				elm$core$String$cons,
				_Utils_chr('0'),
				myrho$elm_round$Round$increaseNum(headtail));
		}
	} else {
		var c = elm$core$Char$toCode(head);
		return ((c >= 48) && (c < 57)) ? A2(
			elm$core$String$cons,
			elm$core$Char$fromCode(c + 1),
			tail) : '0';
	}
};
var myrho$elm_round$Round$splitComma = function (str) {
	var _n0 = A2(elm$core$String$split, '.', str);
	if (_n0.b) {
		if (_n0.b.b) {
			var before = _n0.a;
			var _n1 = _n0.b;
			var after = _n1.a;
			return _Utils_Tuple2(before, after);
		} else {
			var before = _n0.a;
			return _Utils_Tuple2(before, '0');
		}
	} else {
		return _Utils_Tuple2('0', '0');
	}
};
var myrho$elm_round$Round$toDecimal = function (fl) {
	var _n0 = A2(
		elm$core$String$split,
		'e',
		elm$core$String$fromFloat(
			elm$core$Basics$abs(fl)));
	if (_n0.b) {
		if (_n0.b.b) {
			var num = _n0.a;
			var _n1 = _n0.b;
			var exp = _n1.a;
			var e = A2(
				elm$core$Maybe$withDefault,
				0,
				elm$core$String$toInt(
					A2(elm$core$String$startsWith, '+', exp) ? A2(elm$core$String$dropLeft, 1, exp) : exp));
			var _n2 = myrho$elm_round$Round$splitComma(num);
			var before = _n2.a;
			var after = _n2.b;
			var total = _Utils_ap(before, after);
			var zeroed = (e < 0) ? A2(
				elm$core$Maybe$withDefault,
				'0',
				A2(
					elm$core$Maybe$map,
					function (_n3) {
						var a = _n3.a;
						var b = _n3.b;
						return a + ('.' + b);
					},
					A2(
						elm$core$Maybe$map,
						elm$core$Tuple$mapFirst(elm$core$String$fromChar),
						elm$core$String$uncons(
							_Utils_ap(
								A2(
									elm$core$String$repeat,
									elm$core$Basics$abs(e),
									'0'),
								total))))) : A3(
				elm$core$String$padRight,
				e + 1,
				_Utils_chr('0'),
				total);
			return _Utils_ap(
				(fl < 0) ? '-' : '',
				zeroed);
		} else {
			var num = _n0.a;
			return _Utils_ap(
				(fl < 0) ? '-' : '',
				num);
		}
	} else {
		return '';
	}
};
var myrho$elm_round$Round$roundFun = F3(
	function (functor, s, fl) {
		if (elm$core$Basics$isInfinite(fl) || elm$core$Basics$isNaN(fl)) {
			return elm$core$String$fromFloat(fl);
		} else {
			var signed = fl < 0;
			var _n0 = myrho$elm_round$Round$splitComma(
				myrho$elm_round$Round$toDecimal(
					elm$core$Basics$abs(fl)));
			var before = _n0.a;
			var after = _n0.b;
			var r = elm$core$String$length(before) + s;
			var normalized = _Utils_ap(
				A2(elm$core$String$repeat, (-r) + 1, '0'),
				A3(
					elm$core$String$padRight,
					r,
					_Utils_chr('0'),
					_Utils_ap(before, after)));
			var totalLen = elm$core$String$length(normalized);
			var roundDigitIndex = A2(elm$core$Basics$max, 1, r);
			var increase = A2(
				functor,
				signed,
				A3(elm$core$String$slice, roundDigitIndex, totalLen, normalized));
			var remains = A3(elm$core$String$slice, 0, roundDigitIndex, normalized);
			var num = increase ? elm$core$String$reverse(
				A2(
					elm$core$Maybe$withDefault,
					'1',
					A2(
						elm$core$Maybe$map,
						myrho$elm_round$Round$increaseNum,
						elm$core$String$uncons(
							elm$core$String$reverse(remains))))) : remains;
			var numLen = elm$core$String$length(num);
			var numZeroed = (num === '0') ? num : ((s <= 0) ? _Utils_ap(
				num,
				A2(
					elm$core$String$repeat,
					elm$core$Basics$abs(s),
					'0')) : ((_Utils_cmp(
				s,
				elm$core$String$length(after)) < 0) ? (A3(elm$core$String$slice, 0, numLen - s, num) + ('.' + A3(elm$core$String$slice, numLen - s, numLen, num))) : _Utils_ap(
				before + '.',
				A3(
					elm$core$String$padRight,
					s,
					_Utils_chr('0'),
					after))));
			return A2(myrho$elm_round$Round$addSign, signed, numZeroed);
		}
	});
var myrho$elm_round$Round$round = myrho$elm_round$Round$roundFun(
	F2(
		function (signed, str) {
			var _n0 = elm$core$String$uncons(str);
			if (_n0.$ === 'Nothing') {
				return false;
			} else {
				if ('5' === _n0.a.a.valueOf()) {
					if (_n0.a.b === '') {
						var _n1 = _n0.a;
						return !signed;
					} else {
						var _n2 = _n0.a;
						return true;
					}
				} else {
					var _n3 = _n0.a;
					var _int = _n3.a;
					return function (i) {
						return ((i > 53) && signed) || ((i >= 53) && (!signed));
					}(
						elm$core$Char$toCode(_int));
				}
			}
		}));
var terezka$line_charts$Internal$Axis$Values$correctFloat = function (prec) {
	return A2(
		elm$core$Basics$composeR,
		myrho$elm_round$Round$round(prec),
		A2(
			elm$core$Basics$composeR,
			elm$core$String$toFloat,
			elm$core$Maybe$withDefault(0)));
};
var terezka$line_charts$Internal$Axis$Values$getMultiples = F3(
	function (magnitude, allowDecimals, hasTickAmount) {
		var defaults = hasTickAmount ? _List_fromArray(
			[1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10]) : _List_fromArray(
			[1, 2, 2.5, 5, 10]);
		return allowDecimals ? defaults : ((magnitude === 1) ? A2(
			elm$core$List$filter,
			function (n) {
				return _Utils_eq(
					elm$core$Basics$round(n),
					n);
			},
			defaults) : ((magnitude <= 0.1) ? _List_fromArray(
			[1 / magnitude]) : defaults));
	});
var terezka$line_charts$Internal$Axis$Values$getPrecision = function (number) {
	var _n0 = A2(
		elm$core$String$split,
		'e',
		elm$core$String$fromFloat(number));
	if ((_n0.b && _n0.b.b) && (!_n0.b.b.b)) {
		var before = _n0.a;
		var _n1 = _n0.b;
		var after = _n1.a;
		return elm$core$Basics$abs(
			A2(
				elm$core$Maybe$withDefault,
				0,
				elm$core$String$toInt(after)));
	} else {
		var _n2 = A2(
			elm$core$String$split,
			'.',
			elm$core$String$fromFloat(number));
		if ((_n2.b && _n2.b.b) && (!_n2.b.b.b)) {
			var before = _n2.a;
			var _n3 = _n2.b;
			var after = _n3.a;
			return elm$core$String$length(after);
		} else {
			return 0;
		}
	}
};
var elm$core$Basics$e = _Basics_e;
var terezka$line_charts$Internal$Utils$magnitude = function (num) {
	return A2(
		elm$core$Basics$pow,
		10,
		elm$core$Basics$floor(
			A2(elm$core$Basics$logBase, elm$core$Basics$e, num) / A2(elm$core$Basics$logBase, elm$core$Basics$e, 10)));
};
var terezka$line_charts$Internal$Axis$Values$getInterval = F3(
	function (intervalRaw, allowDecimals, hasTickAmount) {
		var magnitude = terezka$line_charts$Internal$Utils$magnitude(intervalRaw);
		var multiples = A3(terezka$line_charts$Internal$Axis$Values$getMultiples, magnitude, allowDecimals, hasTickAmount);
		var normalized = intervalRaw / magnitude;
		var findMultipleExact = function (multiples_) {
			findMultipleExact:
			while (true) {
				if (multiples_.b) {
					var m1 = multiples_.a;
					var rest = multiples_.b;
					if (_Utils_cmp(m1 * magnitude, intervalRaw) > -1) {
						return m1;
					} else {
						var $temp$multiples_ = rest;
						multiples_ = $temp$multiples_;
						continue findMultipleExact;
					}
				} else {
					return 1;
				}
			}
		};
		var findMultiple = function (multiples_) {
			findMultiple:
			while (true) {
				if (multiples_.b) {
					if (multiples_.b.b) {
						var m1 = multiples_.a;
						var _n2 = multiples_.b;
						var m2 = _n2.a;
						var rest = _n2.b;
						if (_Utils_cmp(normalized, (m1 + m2) / 2) < 1) {
							return m1;
						} else {
							var $temp$multiples_ = A2(elm$core$List$cons, m2, rest);
							multiples_ = $temp$multiples_;
							continue findMultiple;
						}
					} else {
						var m1 = multiples_.a;
						var rest = multiples_.b;
						if (_Utils_cmp(normalized, m1) < 1) {
							return m1;
						} else {
							var $temp$multiples_ = rest;
							multiples_ = $temp$multiples_;
							continue findMultiple;
						}
					}
				} else {
					return 1;
				}
			}
		};
		var multiple = hasTickAmount ? findMultipleExact(multiples) : findMultiple(multiples);
		var precision = terezka$line_charts$Internal$Axis$Values$getPrecision(magnitude) + terezka$line_charts$Internal$Axis$Values$getPrecision(multiple);
		return A2(terezka$line_charts$Internal$Axis$Values$correctFloat, precision, multiple * magnitude);
	});
var terezka$line_charts$Internal$Axis$Values$positions = F5(
	function (range, beginning, interval, m, acc) {
		positions:
		while (true) {
			var next = A2(
				terezka$line_charts$Internal$Axis$Values$correctFloat,
				terezka$line_charts$Internal$Axis$Values$getPrecision(interval),
				beginning + (m * interval));
			if (_Utils_cmp(next, range.max) > 0) {
				return acc;
			} else {
				var $temp$range = range,
					$temp$beginning = beginning,
					$temp$interval = interval,
					$temp$m = m + 1,
					$temp$acc = _Utils_ap(
					acc,
					_List_fromArray(
						[next]));
				range = $temp$range;
				beginning = $temp$beginning;
				interval = $temp$interval;
				m = $temp$m;
				acc = $temp$acc;
				continue positions;
			}
		}
	});
var terezka$line_charts$Internal$Axis$Values$values = F4(
	function (allowDecimals, exact, amountRough, range) {
		var intervalRough = (range.max - range.min) / amountRough;
		var interval = A3(terezka$line_charts$Internal$Axis$Values$getInterval, intervalRough, allowDecimals, exact);
		var intervalSafe = (!interval) ? 1 : interval;
		var beginning = A2(terezka$line_charts$Internal$Axis$Values$getBeginning, range.min, intervalSafe);
		var amountRoughSafe = (!amountRough) ? 1 : amountRough;
		return A5(terezka$line_charts$Internal$Axis$Values$positions, range, beginning, intervalSafe, 0, _List_Nil);
	});
var terezka$line_charts$Internal$Axis$Values$float = function (amount) {
	if (amount.$ === 'Exactly') {
		var amount_ = amount.a;
		return A3(terezka$line_charts$Internal$Axis$Values$values, true, true, amount_);
	} else {
		var amount_ = amount.a;
		return A3(terezka$line_charts$Internal$Axis$Values$values, true, false, amount_);
	}
};
var terezka$line_charts$Internal$Axis$Tick$Negative = {$: 'Negative'};
var terezka$line_charts$Internal$Axis$Tick$Config = function (a) {
	return {$: 'Config', a: a};
};
var terezka$line_charts$Internal$Axis$Tick$custom = terezka$line_charts$Internal$Axis$Tick$Config;
var terezka$line_charts$Internal$Axis$Tick$float = function (n) {
	return terezka$line_charts$Internal$Axis$Tick$custom(
		{
			color: terezka$line_charts$LineChart$Colors$gray,
			direction: terezka$line_charts$Internal$Axis$Tick$Negative,
			grid: true,
			label: elm$core$Maybe$Just(
				A2(
					terezka$line_charts$Internal$Svg$label,
					'inherit',
					elm$core$String$fromFloat(n))),
			length: 5,
			position: n,
			width: 1
		});
};
var terezka$line_charts$LineChart$Axis$Tick$float = terezka$line_charts$Internal$Axis$Tick$float;
var terezka$line_charts$Internal$Axis$default = F3(
	function (pixels_, title_, variable_) {
		return terezka$line_charts$Internal$Axis$custom(
			{
				axisLine: terezka$line_charts$Internal$Axis$Line$rangeFrame(terezka$line_charts$LineChart$Colors$gray),
				pixels: pixels_,
				range: A2(terezka$line_charts$Internal$Axis$Range$padded, 20, 20),
				ticks: terezka$line_charts$Internal$Axis$Ticks$custom(
					F2(
						function (data, range_) {
							var smallest = A2(terezka$line_charts$Internal$Coordinate$smallestRange, data, range_);
							var rangeSmall = smallest.max - smallest.min;
							var rangeLong = range_.max - range_.min;
							var diff = 1 - ((rangeLong - rangeSmall) / rangeLong);
							var amount = elm$core$Basics$round((diff * pixels_) / 90);
							return A2(
								elm$core$List$map,
								terezka$line_charts$LineChart$Axis$Tick$float,
								A2(
									terezka$line_charts$Internal$Axis$Values$float,
									terezka$line_charts$Internal$Axis$Values$around(amount),
									smallest));
						})),
				title: A3(terezka$line_charts$Internal$Axis$Title$atDataMax, 0, 0, title_),
				variable: A2(elm$core$Basics$composeL, elm$core$Maybe$Just, variable_)
			});
	});
var terezka$line_charts$LineChart$Axis$default = terezka$line_charts$Internal$Axis$default;
var terezka$line_charts$Internal$Axis$Intersection$Config = function (a) {
	return {$: 'Config', a: a};
};
var terezka$line_charts$Internal$Axis$Intersection$custom = F2(
	function (toX, toY) {
		return terezka$line_charts$Internal$Axis$Intersection$Config(
			function (_n0) {
				var x = _n0.x;
				var y = _n0.y;
				return A2(
					terezka$line_charts$Internal$Data$Point,
					toX(x),
					toY(y));
			});
	});
var terezka$line_charts$Internal$Axis$Intersection$default = A2(
	terezka$line_charts$Internal$Axis$Intersection$custom,
	function ($) {
		return $.min;
	},
	function ($) {
		return $.min;
	});
var terezka$line_charts$LineChart$Axis$Intersection$default = terezka$line_charts$Internal$Axis$Intersection$default;
var terezka$line_charts$LineChart$Container$Margin = F4(
	function (top, right, bottom, left) {
		return {bottom: bottom, left: left, right: right, top: top};
	});
var terezka$line_charts$Internal$Container$Config = function (a) {
	return {$: 'Config', a: a};
};
var terezka$line_charts$Internal$Container$custom = terezka$line_charts$Internal$Container$Config;
var terezka$line_charts$LineChart$Container$custom = terezka$line_charts$Internal$Container$custom;
var terezka$line_charts$Internal$Container$Static = {$: 'Static'};
var terezka$line_charts$Internal$Container$static = terezka$line_charts$Internal$Container$Static;
var terezka$line_charts$LineChart$Container$static = terezka$line_charts$Internal$Container$static;
var terezka$line_charts$Internal$Dots$Circle = {$: 'Circle'};
var terezka$line_charts$LineChart$Dots$circle = terezka$line_charts$Internal$Dots$Circle;
var terezka$line_charts$Internal$Dots$Config = function (a) {
	return {$: 'Config', a: a};
};
var terezka$line_charts$Internal$Dots$custom = function (style_) {
	return terezka$line_charts$Internal$Dots$Config(
		{
			individual: function (_n0) {
				return style_;
			},
			legend: function (_n1) {
				return style_;
			}
		});
};
var terezka$line_charts$LineChart$Dots$custom = terezka$line_charts$Internal$Dots$custom;
var terezka$line_charts$Internal$Dots$Full = {$: 'Full'};
var terezka$line_charts$Internal$Dots$Style = function (a) {
	return {$: 'Style', a: a};
};
var terezka$line_charts$Internal$Dots$style = F2(
	function (radius, variety) {
		return terezka$line_charts$Internal$Dots$Style(
			{radius: radius, variety: variety});
	});
var terezka$line_charts$Internal$Dots$full = function (radius) {
	return A2(terezka$line_charts$Internal$Dots$style, radius, terezka$line_charts$Internal$Dots$Full);
};
var terezka$line_charts$LineChart$Dots$full = terezka$line_charts$Internal$Dots$full;
var terezka$line_charts$Internal$Events$Config = function (a) {
	return {$: 'Config', a: a};
};
var terezka$line_charts$Internal$Events$custom = terezka$line_charts$Internal$Events$Config;
var terezka$line_charts$Internal$Events$default = terezka$line_charts$Internal$Events$custom(_List_Nil);
var terezka$line_charts$LineChart$Events$default = terezka$line_charts$Internal$Events$default;
var terezka$line_charts$Internal$Grid$Lines = F2(
	function (a, b) {
		return {$: 'Lines', a: a, b: b};
	});
var terezka$line_charts$Internal$Grid$lines = terezka$line_charts$Internal$Grid$Lines;
var terezka$line_charts$LineChart$Grid$lines = terezka$line_charts$Internal$Grid$lines;
var terezka$line_charts$Internal$Interpolation$Monotone = {$: 'Monotone'};
var terezka$line_charts$LineChart$Interpolation$monotone = terezka$line_charts$Internal$Interpolation$Monotone;
var terezka$line_charts$Internal$Junk$Config = function (a) {
	return {$: 'Config', a: a};
};
var terezka$line_charts$Internal$Junk$Layers = F3(
	function (below, above, html) {
		return {above: above, below: below, html: html};
	});
var terezka$line_charts$Internal$Junk$none = terezka$line_charts$Internal$Junk$Config(
	F4(
		function (_n0, _n1, _n2, _n3) {
			return A3(terezka$line_charts$Internal$Junk$Layers, _List_Nil, _List_Nil, _List_Nil);
		}));
var terezka$line_charts$LineChart$Junk$default = terezka$line_charts$Internal$Junk$none;
var terezka$line_charts$Internal$Legends$None = {$: 'None'};
var terezka$line_charts$Internal$Legends$none = terezka$line_charts$Internal$Legends$None;
var terezka$line_charts$LineChart$Legends$none = terezka$line_charts$Internal$Legends$none;
var terezka$line_charts$Internal$Line$Config = function (a) {
	return {$: 'Config', a: a};
};
var terezka$line_charts$Internal$Line$Style = function (a) {
	return {$: 'Style', a: a};
};
var terezka$line_charts$Internal$Line$style = F2(
	function (width, color_) {
		return terezka$line_charts$Internal$Line$Style(
			{color: color_, width: width});
	});
var terezka$line_charts$Internal$Line$wider = function (width) {
	return terezka$line_charts$Internal$Line$Config(
		function (_n0) {
			return A2(terezka$line_charts$Internal$Line$style, width, elm$core$Basics$identity);
		});
};
var terezka$line_charts$LineChart$Line$wider = terezka$line_charts$Internal$Line$wider;
var author$project$AreaCurve$view = function (slices) {
	var xys = A2(
		elm$core$List$map,
		function (c) {
			return _Utils_Tuple2(c.x, c.area);
		},
		author$project$HullSlicesMetrics$getCentroidAreaForEachImmersedSlice(slices));
	return A2(
		elm$html$Html$div,
		_List_fromArray(
			[
				elm$html$Html$Attributes$id('area-curve-plot-container')
			]),
		_List_fromArray(
			[
				A2(
				terezka$line_charts$LineChart$viewCustom,
				{
					area: terezka$line_charts$LineChart$Area$stacked(0.2),
					container: terezka$line_charts$LineChart$Container$custom(
						{
							attributesHtml: _List_fromArray(
								[
									A2(elm$html$Html$Attributes$style, 'font-family', 'monospace')
								]),
							attributesSvg: _List_Nil,
							id: 'area-curve-plot',
							margin: A4(terezka$line_charts$LineChart$Container$Margin, 0, 10, 20, 30),
							size: terezka$line_charts$LineChart$Container$static
						}),
					dots: terezka$line_charts$LineChart$Dots$custom(
						terezka$line_charts$LineChart$Dots$full(10)),
					events: terezka$line_charts$LineChart$Events$default,
					grid: A2(terezka$line_charts$LineChart$Grid$lines, 1, terezka$line_charts$LineChart$Colors$gray),
					interpolation: terezka$line_charts$LineChart$Interpolation$monotone,
					intersection: terezka$line_charts$LineChart$Axis$Intersection$default,
					junk: terezka$line_charts$LineChart$Junk$default,
					legends: terezka$line_charts$LineChart$Legends$none,
					line: terezka$line_charts$LineChart$Line$wider(3),
					x: A3(terezka$line_charts$LineChart$Axis$default, 231, 'x', elm$core$Tuple$first),
					y: A3(terezka$line_charts$LineChart$Axis$default, 231, 'Area', elm$core$Tuple$second)
				},
				_List_fromArray(
					[
						A4(terezka$line_charts$LineChart$line, terezka$line_charts$LineChart$Colors$gray, terezka$line_charts$LineChart$Dots$circle, 'Area curve', xys)
					]))
			]));
};
var author$project$HullSliceModifiers$setBreadth = F2(
	function (breadth, hullSlices) {
		var oldCustomHullProperties = hullSlices.custom;
		var customBreadthUpdated = A2(author$project$StringValueInput$setString, breadth, hullSlices.breadth);
		var newCustomHullProperties = (!_Utils_eq(customBreadthUpdated, hullSlices.breadth)) ? _Utils_update(
			oldCustomHullProperties,
			{
				breadth: elm$core$Maybe$Just(customBreadthUpdated)
			}) : _Utils_update(
			oldCustomHullProperties,
			{breadth: elm$core$Maybe$Nothing});
		return _Utils_update(
			hullSlices,
			{custom: newCustomHullProperties});
	});
var author$project$HullSliceModifiers$setDepth = F2(
	function (depth, hullSlices) {
		var oldCustomHullProperties = hullSlices.custom;
		var customDepthUpdated = A2(author$project$StringValueInput$setString, depth, hullSlices.depth);
		var newCustomHullProperties = (!_Utils_eq(customDepthUpdated, hullSlices.depth)) ? _Utils_update(
			oldCustomHullProperties,
			{
				depth: elm$core$Maybe$Just(customDepthUpdated)
			}) : _Utils_update(
			oldCustomHullProperties,
			{depth: elm$core$Maybe$Nothing});
		return _Utils_update(
			hullSlices,
			{custom: newCustomHullProperties});
	});
var author$project$HullSliceModifiers$setDraught = F2(
	function (draught, hullSlices) {
		var oldCustomHullProperties = hullSlices.custom;
		var customDraughtUpdated = A2(author$project$StringValueInput$setString, draught, hullSlices.draught);
		var newCustomHullProperties = (!_Utils_eq(customDraughtUpdated, hullSlices.draught)) ? _Utils_update(
			oldCustomHullProperties,
			{
				draught: elm$core$Maybe$Just(customDraughtUpdated)
			}) : _Utils_update(
			oldCustomHullProperties,
			{draught: elm$core$Maybe$Nothing});
		return _Utils_update(
			hullSlices,
			{custom: newCustomHullProperties});
	});
var author$project$HullSliceModifiers$setLengthOverAll = F2(
	function (loa, hullSlices) {
		var oldCustomHullProperties = hullSlices.custom;
		var customLengthUpdated = A2(author$project$StringValueInput$setString, loa, hullSlices.length);
		var newCustomHullProperties = (!_Utils_eq(customLengthUpdated, hullSlices.length)) ? _Utils_update(
			oldCustomHullProperties,
			{
				length: elm$core$Maybe$Just(customLengthUpdated)
			}) : _Utils_update(
			oldCustomHullProperties,
			{length: elm$core$Maybe$Nothing});
		return _Utils_update(
			hullSlices,
			{custom: newCustomHullProperties});
	});
var author$project$HullSlicesMetrics$getPrismaticCoefficient = function (hullSlicesMetrics) {
	var hs = function () {
		var hs_ = hullSlicesMetrics.a;
		return hs_;
	}();
	return hs.prismaticCoefficient;
};
var author$project$HullSlicesMetrics$getSlices = function (hullSlicesMetrics) {
	var hs = function () {
		var hs_ = hullSlicesMetrics.a;
		return hs_;
	}();
	return hs.slices;
};
var author$project$Lackenby$getLongitudinalPositionOfEachSlice = F3(
	function (hullSlices, hullSlicesMetrics, newXPositions) {
		var normalize = function (x) {
			return (x - author$project$HullSlicesMetrics$getXmin(hullSlicesMetrics)) / author$project$HullSlicesMetrics$getLength(hullSlicesMetrics).value;
		};
		var xmaxOfAreaCurve = A2(
			author$project$StringValueInput$round_n,
			4,
			A2(
				elm$core$Maybe$withDefault,
				author$project$HullSlicesMetrics$getXmin(hullSlicesMetrics) + author$project$HullSlicesMetrics$getLength(hullSlicesMetrics).value,
				elm$core$List$maximum(
					A2(
						elm$core$List$map,
						A2(
							elm$core$Basics$composeR,
							function ($) {
								return $.x;
							},
							normalize),
						author$project$HullSlicesMetrics$getCentroidAreaForEachImmersedSlice(hullSlicesMetrics)))));
		var positionsAfterXmaxOfAreaCurve = A2(
			elm$core$List$map,
			function ($) {
				return $.x;
			},
			A2(
				elm$core$List$filter,
				function (slice) {
					return _Utils_cmp(
						A2(author$project$StringValueInput$round_n, 4, slice.x),
						xmaxOfAreaCurve) > 0;
				},
				author$project$HullSlicesMetrics$getSlices(hullSlicesMetrics)));
		var xminOfAreaCurve = A2(
			author$project$StringValueInput$round_n,
			4,
			A3(
				elm$core$Basics$apL,
				elm$core$Maybe$withDefault,
				author$project$HullSlicesMetrics$getXmin(hullSlicesMetrics),
				elm$core$List$minimum(
					A2(
						elm$core$List$map,
						A2(
							elm$core$Basics$composeR,
							function ($) {
								return $.x;
							},
							normalize),
						author$project$HullSlicesMetrics$getCentroidAreaForEachImmersedSlice(hullSlicesMetrics)))));
		var positionsBeforeXminOfAreaCurve = A2(
			elm$core$List$map,
			function ($) {
				return $.x;
			},
			A2(
				elm$core$List$filter,
				function (slice) {
					return _Utils_cmp(
						A2(author$project$StringValueInput$round_n, 4, slice.x),
						xminOfAreaCurve) < 0;
				},
				author$project$HullSlicesMetrics$getSlices(hullSlicesMetrics)));
		return _Utils_ap(
			positionsBeforeXminOfAreaCurve,
			_Utils_ap(
				A2(elm$core$List$map, normalize, newXPositions),
				positionsAfterXmaxOfAreaCurve));
	});
var author$project$HullSlicesMetrics$getHullSlicesBeneathFreeSurface = function (hullSlicesMetrics) {
	var hs = function () {
		var hs_ = hullSlicesMetrics.a;
		return hs_;
	}();
	return hs.hullSlicesBeneathFreeSurface;
};
var author$project$Lackenby$shiftAreaCurve = F2(
	function (c, areaCurve) {
		var maybePositionMaxArea = A2(
			elm$core$Maybe$map,
			elm$core$Tuple$first,
			A2(elm_community$list_extra$List$Extra$maximumBy, elm$core$Tuple$second, areaCurve));
		var maybeMinMax = function () {
			var xs = A2(elm$core$List$map, elm$core$Tuple$first, areaCurve);
			var _n3 = _Utils_Tuple2(
				elm$core$List$minimum(xs),
				elm$core$List$maximum(xs));
			if ((_n3.a.$ === 'Just') && (_n3.b.$ === 'Just')) {
				var mi = _n3.a.a;
				var ma = _n3.b.a;
				return elm$core$Maybe$Just(
					_Utils_Tuple2(mi, ma));
			} else {
				return elm$core$Maybe$Nothing;
			}
		}();
		var dx = function (x) {
			return (c * x) * (1 - x);
		};
		var shift = F4(
			function (xmin, xmax, x0, _n2) {
				var x = _n2.a;
				var a = _n2.b;
				if (_Utils_cmp(x, x0) < 0) {
					var x_ = (x - xmin) / (x0 - xmin);
					return _Utils_Tuple2(
						((x_ - dx(x_)) * (x0 - xmin)) + xmin,
						a);
				} else {
					var x_ = (x - x0) / (xmax - x0);
					return _Utils_Tuple2(
						((x_ + dx(x_)) * (xmax - x0)) + x0,
						a);
				}
			});
		var _n0 = _Utils_Tuple2(maybePositionMaxArea, maybeMinMax);
		if ((_n0.a.$ === 'Just') && (_n0.b.$ === 'Just')) {
			var x0 = _n0.a.a;
			var _n1 = _n0.b.a;
			var xmin = _n1.a;
			var xmax = _n1.b;
			return A2(
				elm$core$List$map,
				A3(shift, xmin, xmax, x0),
				areaCurve);
		} else {
			return areaCurve;
		}
	});
var author$project$Lackenby$lackenby = F4(
	function (targetPrismaticCoefficient, lengthAtWaterline, masterCrossSectionArea, areaCurve) {
		var lackenby_ = F5(
			function (tolerance, niterMax, niter, cLow, cHigh) {
				lackenby_:
				while (true) {
					var reachedTolerance = function (c) {
						return (!targetPrismaticCoefficient) ? (_Utils_cmp(
							elm$core$Basics$abs(c - targetPrismaticCoefficient),
							tolerance) < 0) : (_Utils_cmp(
							elm$core$Basics$abs(c - targetPrismaticCoefficient) / targetPrismaticCoefficient,
							tolerance) < 0);
					};
					var lowAreaCurve = A2(author$project$Lackenby$shiftAreaCurve, cLow, areaCurve);
					var highAreaCurve = A2(author$project$Lackenby$shiftAreaCurve, cHigh, areaCurve);
					var getPrismaticCoeff = function (curve) {
						return (1 / (lengthAtWaterline * masterCrossSectionArea)) * author$project$HullSlices$integrate(curve);
					};
					var highPrismaticCoeff = getPrismaticCoeff(highAreaCurve);
					var lowPrismaticCoeff = getPrismaticCoeff(lowAreaCurve);
					var cMid = (cLow + cHigh) / 2;
					var midAreaCurve = A2(author$project$Lackenby$shiftAreaCurve, cMid, areaCurve);
					var midPrismaticCoeff = getPrismaticCoeff(midAreaCurve);
					if (_Utils_cmp(lowPrismaticCoeff, targetPrismaticCoefficient) > 0) {
						return elm$core$Result$Err('target prismatic coefficient is lower than the lowest bound');
					} else {
						if (_Utils_cmp(highPrismaticCoeff, targetPrismaticCoefficient) < 0) {
							return elm$core$Result$Err('target prismatic coefficient is higher than the lowest bound');
						} else {
							if (reachedTolerance(lowPrismaticCoeff)) {
								return elm$core$Result$Ok(lowAreaCurve);
							} else {
								if (reachedTolerance(highPrismaticCoeff)) {
									return elm$core$Result$Ok(highAreaCurve);
								} else {
									if (reachedTolerance(midPrismaticCoeff)) {
										return elm$core$Result$Ok(midAreaCurve);
									} else {
										if (_Utils_cmp(niter, niterMax) > 0) {
											return elm$core$Result$Err('Unable to reach tolerance.');
										} else {
											if (_Utils_cmp(midPrismaticCoeff, targetPrismaticCoefficient) > 0) {
												var $temp$tolerance = tolerance,
													$temp$niterMax = niterMax,
													$temp$niter = niter + 1,
													$temp$cLow = cLow,
													$temp$cHigh = cMid;
												tolerance = $temp$tolerance;
												niterMax = $temp$niterMax;
												niter = $temp$niter;
												cLow = $temp$cLow;
												cHigh = $temp$cHigh;
												continue lackenby_;
											} else {
												var $temp$tolerance = tolerance,
													$temp$niterMax = niterMax,
													$temp$niter = niter + 1,
													$temp$cLow = cMid,
													$temp$cHigh = cHigh;
												tolerance = $temp$tolerance;
												niterMax = $temp$niterMax;
												niter = $temp$niter;
												cLow = $temp$cLow;
												cHigh = $temp$cHigh;
												continue lackenby_;
											}
										}
									}
								}
							}
						}
					}
				}
			});
		return A5(lackenby_, 1.0e-3, 10, 0, -1, 1);
	});
var author$project$Lackenby$lackenbyHS = F2(
	function (targetPrismaticCoefficient, hullSlicesMetrics) {
		var _n0 = author$project$HullSlicesMetrics$getMasterCrossSection(hullSlicesMetrics);
		if (_n0.$ === 'Nothing') {
			return elm$core$Result$Err('Unable to compute master cross section');
		} else {
			var masterCrossSectionArea = _n0.a;
			var lengthAtWaterline = author$project$HullSlicesMetrics$getHullSlicesBeneathFreeSurface(hullSlicesMetrics).xmax - author$project$HullSlicesMetrics$getHullSlicesBeneathFreeSurface(hullSlicesMetrics).xmin;
			var areaCurve = A2(
				elm$core$List$map,
				function (c) {
					return _Utils_Tuple2(c.x, c.area);
				},
				author$project$HullSlicesMetrics$getCentroidAreaForEachImmersedSlice(hullSlicesMetrics));
			return A4(author$project$Lackenby$lackenby, targetPrismaticCoefficient, lengthAtWaterline, masterCrossSectionArea.area, areaCurve);
		}
	});
var author$project$Lackenby$resetOriginalSlicesLongitudinalPositions = function (hullSlices) {
	var oldCustomHullProperties = hullSlices.custom;
	var newCustomHullProperties = _Utils_update(
		oldCustomHullProperties,
		{
			hullslicesPositions: elm$core$Maybe$Just(hullSlices.originalSlicePositions)
		});
	return _Utils_update(
		hullSlices,
		{custom: newCustomHullProperties});
};
var author$project$Lackenby$getPrismaticCoefficientBounds = F3(
	function (lengthAtWaterline, masterCrossSectionArea, areaCurve) {
		var getPrismaticCoeff = function (curve) {
			return (1 / (lengthAtWaterline * masterCrossSectionArea)) * author$project$HullSlices$integrate(curve);
		};
		return _Utils_Tuple2(
			getPrismaticCoeff(
				A2(author$project$Lackenby$shiftAreaCurve, -1, areaCurve)),
			getPrismaticCoeff(
				A2(author$project$Lackenby$shiftAreaCurve, 1, areaCurve)));
	});
var author$project$Lackenby$clampPrismaticCoefficient = F4(
	function (prismaticCoeff, lengthAtWaterline, masterCrossSectionArea, areaCurve) {
		var _n0 = A3(author$project$Lackenby$getPrismaticCoefficientBounds, lengthAtWaterline, masterCrossSectionArea, areaCurve);
		var minCoeff = _n0.a;
		var maxCoeff = _n0.b;
		return A2(
			author$project$StringValueInput$round_n,
			2,
			A3(elm$core$Basics$clamp, minCoeff, maxCoeff, prismaticCoeff));
	});
var author$project$Lackenby$setPrismaticCoefficientAndClamp = F2(
	function (prismaticCoefficient, hullSlicesMetrics) {
		var _n0 = author$project$HullSlicesMetrics$getMasterCrossSection(hullSlicesMetrics);
		if (_n0.$ === 'Nothing') {
			return prismaticCoefficient;
		} else {
			var masterCrossSectionArea = _n0.a;
			var lengthAtWaterline = author$project$HullSlicesMetrics$getHullSlicesBeneathFreeSurface(hullSlicesMetrics).xmax - author$project$HullSlicesMetrics$getHullSlicesBeneathFreeSurface(hullSlicesMetrics).xmin;
			var areaCurve = A2(
				elm$core$List$map,
				function (c) {
					return _Utils_Tuple2(c.x, c.area);
				},
				author$project$HullSlicesMetrics$getCentroidAreaForEachImmersedSlice(hullSlicesMetrics));
			return A4(author$project$Lackenby$clampPrismaticCoefficient, prismaticCoefficient, lengthAtWaterline, masterCrossSectionArea.area, areaCurve);
		}
	});
var elm$core$Result$toMaybe = function (result) {
	if (result.$ === 'Ok') {
		var v = result.a;
		return elm$core$Maybe$Just(v);
	} else {
		return elm$core$Maybe$Nothing;
	}
};
var author$project$Lackenby$modifyHullSlicesToMatchTargetPrismaticCoefficient = F2(
	function (prismaticCoefficient, hullSlices) {
		var originalHullSlices = author$project$HullSlicesMetrics$fillHullSliceMetrics(
			author$project$Lackenby$resetOriginalSlicesLongitudinalPositions(hullSlices));
		var hullSlicesMetrics = author$project$HullSlicesMetrics$fillHullSliceMetrics(hullSlices);
		var clampedPrismaticCoefficient = function () {
			var _n0 = elm$core$String$toFloat(prismaticCoefficient);
			if (_n0.$ === 'Nothing') {
				return author$project$HullSlicesMetrics$getPrismaticCoefficient(hullSlicesMetrics).value;
			} else {
				var pc = _n0.a;
				return A2(author$project$Lackenby$setPrismaticCoefficientAndClamp, pc, originalHullSlices);
			}
		}();
		var maybeNewXPositions = function (hs) {
			return A2(
				elm$core$Maybe$map,
				elm$core$List$map(elm$core$Tuple$first),
				elm$core$Result$toMaybe(
					A2(author$project$Lackenby$lackenbyHS, clampedPrismaticCoefficient, originalHullSlices)));
		};
		return A2(
			elm$core$Maybe$withDefault,
			A2(
				elm$core$Maybe$withDefault,
				A2(
					elm$core$List$map,
					function ($) {
						return $.x;
					},
					hullSlices.slices),
				hullSlices.custom.hullslicesPositions),
			A2(
				elm$core$Maybe$map,
				A2(author$project$Lackenby$getLongitudinalPositionOfEachSlice, hullSlices, originalHullSlices),
				maybeNewXPositions(originalHullSlices)));
	});
var author$project$HullSliceModifiers$setPrismaticCoefficient = F2(
	function (prismaticCoefficient, hullSlices) {
		var oldCustomHullProperties = hullSlices.custom;
		var hullSlicesPosition = A2(author$project$Lackenby$modifyHullSlicesToMatchTargetPrismaticCoefficient, prismaticCoefficient, hullSlices);
		var newCustomHullProperties = (!_Utils_eq(
			hullSlicesPosition,
			A2(
				elm$core$List$map,
				function ($) {
					return $.x;
				},
				hullSlices.slices))) ? _Utils_update(
			oldCustomHullProperties,
			{
				hullslicesPositions: elm$core$Maybe$Just(hullSlicesPosition)
			}) : _Utils_update(
			oldCustomHullProperties,
			{hullslicesPositions: elm$core$Maybe$Nothing});
		return _Utils_update(
			hullSlices,
			{custom: newCustomHullProperties});
	});
var author$project$HullSlicesMetrics$getBlockCoefficient = function (hullSlicesMetrics) {
	var hs = function () {
		var hs_ = hullSlicesMetrics.a;
		return hs_;
	}();
	return hs.blockCoefficient;
};
var author$project$HullSlicesMetrics$getCenterOfBuoyancy = function (hullSlicesMetrics) {
	var hs = function () {
		var hs_ = hullSlicesMetrics.a;
		return hs_;
	}();
	return hs.centreOfBuoyancy;
};
var author$project$HullSlicesMetrics$getDisplacement = function (hullSlicesMetrics) {
	var hs = function () {
		var hs_ = hullSlicesMetrics.a;
		return hs_;
	}();
	return hs.displacement;
};
var author$project$HullSlicesMetrics$getMetacentre = function (hullSlicesMetrics) {
	var hs = function () {
		var hs_ = hullSlicesMetrics.a;
		return hs_;
	}();
	return hs.metacentre;
};
var author$project$Main$ExportCSV = function (a) {
	return {$: 'ExportCSV', a: a};
};
var author$project$Main$ExportSTL = function (a) {
	return {$: 'ExportSTL', a: a};
};
var author$project$Main$ModifySlice = F3(
	function (a, b, c) {
		return {$: 'ModifySlice', a: a, b: b, c: c};
	});
var author$project$Main$ResetSlice = function (a) {
	return {$: 'ResetSlice', a: a};
};
var elm$html$Html$button = _VirtualDom_node('button');
var elm$html$Html$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			_VirtualDom_property,
			key,
			elm$json$Json$Encode$bool(bool));
	});
var elm$html$Html$Attributes$hidden = elm$html$Html$Attributes$boolProperty('hidden');
var author$project$Main$resetHullSlices = function (model) {
	var hullReference = function () {
		var _n1 = model.selectedHullReference;
		if (_n1.$ === 'Just') {
			var hullName = _n1.a;
			return hullName;
		} else {
			return '';
		}
	}();
	var isResetButtonDisplayed = function () {
		var _n0 = A2(elm$core$Dict$get, hullReference, model.slices);
		if (_n0.$ === 'Nothing') {
			return true;
		} else {
			var hullSlices = _n0.a;
			return !author$project$HullSlices$isHullCustomized(hullSlices);
		}
	}();
	return A2(
		elm$html$Html$div,
		_List_fromArray(
			[
				elm$html$Html$Attributes$class('reset-button')
			]),
		_List_fromArray(
			[
				A2(
				elm$html$Html$button,
				_List_fromArray(
					[
						elm$html$Html$Attributes$id('buttonReset'),
						elm$html$Html$Attributes$hidden(isResetButtonDisplayed),
						elm$html$Html$Events$onClick(
						author$project$Main$ToJs(
							author$project$Main$ResetSlice(hullReference))),
						elm$html$Html$Attributes$title('Reset parameters to origin')
					]),
				_List_fromArray(
					[
						elm$html$Html$text('Reset')
					]))
			]));
};
var lattyware$elm_fontawesome$FontAwesome$Solid$arrowLeft = lattyware$elm_fontawesome$FontAwesome$Icon$view(
	A5(lattyware$elm_fontawesome$FontAwesome$Icon$Icon, 'fas', 'arrow-left', 'svg-inline--fa fa-arrow-left fa-w-14', '0 0 448 512', 'M257.5 445.1l-22.2 22.2c-9.4 9.4-24.6 9.4-33.9 0L7 273c-9.4-9.4-9.4-24.6 0-33.9L201.4 44.7c9.4-9.4 24.6-9.4 33.9 0l22.2 22.2c9.5 9.5 9.3 25-.4 34.3L136.6 216H424c13.3 0 24 10.7 24 24v32c0 13.3-10.7 24-24 24H136.6l120.5 114.8c9.8 9.3 10 24.8.4 34.3z'));
var author$project$Main$viewBackToHullList = A2(
	elm$html$Html$div,
	_List_fromArray(
		[
			elm$html$Html$Attributes$class('focus-back'),
			elm$html$Html$Events$onClick(
			author$project$Main$ToJs(
				author$project$Main$SwitchViewMode(
					author$project$Main$Hull(author$project$Main$HullLibrary))))
		]),
	_List_fromArray(
		[
			lattyware$elm_fontawesome$FontAwesome$Solid$arrowLeft(_List_Nil)
		]));
var author$project$Main$ToggleSlicesDetails = F2(
	function (a, b) {
		return {$: 'ToggleSlicesDetails', a: a, b: b};
	});
var author$project$Main$isAccordionOpened = F2(
	function (uiState, accordionId) {
		return A2(
			elm$core$Maybe$withDefault,
			false,
			A2(elm$core$Dict$get, accordionId, uiState.accordions));
	});
var author$project$HullSlices$extractXYZ = function (hs) {
	var extract = function (zy) {
		return {x: hs.x, y: zy.b, z: zy.a};
	};
	return A2(elm$core$List$map, extract, hs.zylist);
};
var elm$html$Html$Attributes$disabled = elm$html$Html$Attributes$boolProperty('disabled');
var author$project$Main$viewHullSliceCoordinate = function (xyz) {
	return A2(
		elm$html$Html$li,
		_List_fromArray(
			[
				elm$html$Html$Attributes$class('slices-item input-group')
			]),
		_List_fromArray(
			[
				A2(
				elm$html$Html$input,
				_List_fromArray(
					[
						elm$html$Html$Attributes$type_('text'),
						elm$html$Html$Attributes$disabled(true),
						elm$html$Html$Attributes$value(
						elm$core$String$fromFloat(
							A2(author$project$StringValueInput$round_n, 2, xyz.x)))
					]),
				_List_Nil),
				A2(
				elm$html$Html$input,
				_List_fromArray(
					[
						elm$html$Html$Attributes$type_('text'),
						elm$html$Html$Attributes$disabled(true),
						elm$html$Html$Attributes$value(
						elm$core$String$fromFloat(
							A2(author$project$StringValueInput$round_n, 2, xyz.y)))
					]),
				_List_Nil),
				A2(
				elm$html$Html$input,
				_List_fromArray(
					[
						elm$html$Html$Attributes$type_('text'),
						elm$html$Html$Attributes$disabled(true),
						elm$html$Html$Attributes$value(
						elm$core$String$fromFloat(
							-A2(author$project$StringValueInput$round_n, 2, xyz.z)))
					]),
				_List_Nil)
			]));
};
var author$project$Main$viewHullSliceList = F2(
	function (hullslices, sliceSelected) {
		var slices = author$project$HullSlices$setLongitudinalPositionOfEachSlice(hullslices);
		var metrics = {
			breadth: author$project$HullSlices$getBreadth(hullslices).value,
			depth: author$project$HullSlices$getDepth(hullslices).value,
			length: author$project$HullSlices$getLength(hullslices).value,
			xmin: hullslices.xmin,
			zmin: hullslices.zmin
		};
		var _n0 = elm$core$List$head(
			A2(elm$core$List$drop, sliceSelected - 1, slices));
		if (_n0.$ === 'Nothing') {
			return elm$html$Html$text('');
		} else {
			var slice = _n0.a;
			return A2(
				elm$html$Html$ul,
				_List_fromArray(
					[
						elm$html$Html$Attributes$class('slices-list')
					]),
				A2(
					elm$core$List$append,
					_List_fromArray(
						[
							A2(
							elm$html$Html$li,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('slices-item-title input-group')
								]),
							_List_fromArray(
								[
									A2(
									elm$html$Html$input,
									_List_fromArray(
										[
											elm$html$Html$Attributes$type_('text'),
											elm$html$Html$Attributes$disabled(true),
											elm$html$Html$Attributes$value('x')
										]),
									_List_Nil),
									A2(
									elm$html$Html$input,
									_List_fromArray(
										[
											elm$html$Html$Attributes$type_('text'),
											elm$html$Html$Attributes$disabled(true),
											elm$html$Html$Attributes$value('y')
										]),
									_List_Nil),
									A2(
									elm$html$Html$input,
									_List_fromArray(
										[
											elm$html$Html$Attributes$type_('text'),
											elm$html$Html$Attributes$disabled(true),
											elm$html$Html$Attributes$value('z')
										]),
									_List_Nil)
								]))
						]),
					A2(
						elm$core$List$map,
						author$project$Main$viewHullSliceCoordinate,
						author$project$HullSlices$extractXYZ(
							author$project$HullSlices$toHullSliceAsZYList(
								A2(author$project$HullSlices$denormalizeHullSlice, metrics, slice))))));
		}
	});
var author$project$Main$SelectSlice = F3(
	function (a, b, c) {
		return {$: 'SelectSlice', a: a, b: b, c: c};
	});
var author$project$Main$CancelReadClipboard = {$: 'CancelReadClipboard'};
var elm$html$Html$Events$onBlur = function (msg) {
	return A2(
		elm$html$Html$Events$on,
		'blur',
		elm$json$Json$Decode$succeed(msg));
};
var author$project$Main$viewHiddenInputToPasteClipboard = A2(
	elm$html$Html$div,
	_List_fromArray(
		[
			elm$html$Html$Attributes$class('slices-clipboard-receiver')
		]),
	_List_fromArray(
		[
			A2(elm$html$Html$label, _List_Nil, _List_Nil),
			A2(
			elm$html$Html$input,
			_List_fromArray(
				[
					elm$html$Html$Attributes$type_('text'),
					elm$html$Html$Attributes$id('slices-clipboard-receiver'),
					elm$html$Html$Attributes$value(''),
					elm$html$Html$Events$onBlur(
					author$project$Main$NoJs(author$project$Main$CancelReadClipboard))
				]),
			_List_Nil)
		]));
var author$project$Main$ReadClipboard = {$: 'ReadClipboard'};
var lattyware$elm_fontawesome$FontAwesome$Solid$externalLinkAlt = lattyware$elm_fontawesome$FontAwesome$Icon$view(
	A5(lattyware$elm_fontawesome$FontAwesome$Icon$Icon, 'fas', 'external-link-alt', 'svg-inline--fa fa-external-link-alt fa-w-18', '0 0 576 512', 'M576 24v127.984c0 21.461-25.96 31.98-40.971 16.971l-35.707-35.709-243.523 243.523c-9.373 9.373-24.568 9.373-33.941 0l-22.627-22.627c-9.373-9.373-9.373-24.569 0-33.941L442.756 76.676l-35.703-35.705C391.982 25.9 402.656 0 424.024 0H552c13.255 0 24 10.745 24 24zM407.029 270.794l-16 16A23.999 23.999 0 0 0 384 303.765V448H64V128h264a24.003 24.003 0 0 0 16.97-7.029l16-16C376.089 89.851 365.381 64 344 64H48C21.49 64 0 85.49 0 112v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V287.764c0-21.382-25.852-32.09-40.971-16.97z'));
var lattyware$elm_fontawesome$FontAwesome$Solid$times = lattyware$elm_fontawesome$FontAwesome$Icon$view(
	A5(lattyware$elm_fontawesome$FontAwesome$Icon$Icon, 'fas', 'times', 'svg-inline--fa fa-times fa-w-11', '0 0 352 512', 'M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z'));
var author$project$Main$viewHullSliceImportButton = function (uiState) {
	return uiState.waitToPasteClipBoard ? A2(
		elm$html$Html$div,
		_List_fromArray(
			[
				elm$html$Html$Attributes$class('slices-import-active'),
				elm$html$Html$Attributes$id('slices-import-active')
			]),
		_List_fromArray(
			[
				A2(
				elm$html$Html$div,
				_List_fromArray(
					[
						elm$html$Html$Attributes$class('slices-import-message')
					]),
				_List_fromArray(
					[
						elm$html$Html$text('press ctrl+v to import')
					])),
				A2(
				elm$html$Html$div,
				_List_fromArray(
					[
						elm$html$Html$Attributes$class('as-button slices-import-close'),
						elm$html$Html$Attributes$id('slices-import-close'),
						elm$html$Html$Attributes$title('Cancel the import'),
						elm$html$Html$Events$onClick(
						author$project$Main$NoJs(author$project$Main$CancelReadClipboard))
					]),
				_List_fromArray(
					[
						lattyware$elm_fontawesome$FontAwesome$Solid$times(_List_Nil)
					]))
			])) : A2(
		elm$html$Html$div,
		_List_fromArray(
			[
				elm$html$Html$Attributes$class('as-button slices-import'),
				elm$html$Html$Attributes$id('slices-import'),
				elm$html$Html$Attributes$title('Paste list of slices from clipboard'),
				elm$html$Html$Events$onClick(
				author$project$Main$ToJs(author$project$Main$ReadClipboard))
			]),
		_List_fromArray(
			[
				lattyware$elm_fontawesome$FontAwesome$Solid$externalLinkAlt(_List_Nil)
			]));
};
var elm$core$String$toLower = _String_toLower;
var author$project$StringValueInput$makeID = function (description) {
	var alphanumeric = 'abcdefghijklmnopqrstuvxwyz0123456789-_';
	var isAlphanumeric = function (_char) {
		return A2(
			elm$core$String$contains,
			elm$core$String$fromChar(_char),
			alphanumeric);
	};
	return A2(
		elm$core$String$filter,
		isAlphanumeric,
		A2(
			elm$core$String$join,
			'-',
			A2(
				elm$core$String$split,
				' ',
				elm$core$String$toLower(description))));
};
var elm$html$Html$Attributes$min = elm$html$Html$Attributes$stringProperty('min');
var author$project$StringValueInput$viewIntInput = F2(
	function (intInput_, onChange) {
		var generatedID = author$project$StringValueInput$makeID(intInput_.description);
		return A2(
			elm$html$Html$div,
			_List_fromArray(
				[
					elm$html$Html$Attributes$class('input-group')
				]),
			_List_fromArray(
				[
					A2(
					elm$html$Html$label,
					_List_fromArray(
						[
							elm$html$Html$Attributes$for(generatedID)
						]),
					_List_fromArray(
						[
							elm$html$Html$text(intInput_.description)
						])),
					A2(
					elm$html$Html$input,
					_List_fromArray(
						[
							elm$html$Html$Attributes$type_('number'),
							elm$html$Html$Attributes$id(generatedID),
							elm$html$Html$Attributes$value(intInput_.string),
							elm$html$Html$Attributes$min('0'),
							elm$html$Html$Events$onInput(onChange)
						]),
					_List_Nil)
				]));
	});
var author$project$Main$viewHullSliceSelector = F3(
	function (uiState, hullReference, slices) {
		var sliceSelector = function () {
			var _n0 = elm$core$List$isEmpty(slices);
			if (_n0) {
				return A2(
					elm$html$Html$div,
					_List_fromArray(
						[
							elm$html$Html$Attributes$class('input-group slices-message')
						]),
					_List_fromArray(
						[
							A2(
							elm$html$Html$label,
							_List_Nil,
							_List_fromArray(
								[
									elm$html$Html$text('slice no.')
								])),
							A2(
							elm$html$Html$input,
							_List_fromArray(
								[
									elm$html$Html$Attributes$type_('text'),
									elm$html$Html$Attributes$disabled(true),
									elm$html$Html$Attributes$value('No slices')
								]),
							_List_Nil)
						]));
			} else {
				return A2(
					author$project$StringValueInput$viewIntInput,
					uiState.selectedSlice,
					A2(
						elm$core$Basics$composeL,
						author$project$Main$ToJs,
						A2(
							author$project$Main$SelectSlice,
							hullReference,
							elm$core$List$length(slices))));
			}
		}();
		return A2(
			elm$html$Html$div,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					elm$html$Html$div,
					_List_fromArray(
						[
							elm$html$Html$Attributes$class('slices-selector')
						]),
					_List_fromArray(
						[
							sliceSelector,
							author$project$Main$viewHullSliceImportButton(uiState),
							author$project$Main$viewHiddenInputToPasteClipboard
						]))
				]));
	});
var lattyware$elm_fontawesome$FontAwesome$Solid$angleDown = lattyware$elm_fontawesome$FontAwesome$Icon$view(
	A5(lattyware$elm_fontawesome$FontAwesome$Icon$Icon, 'fas', 'angle-down', 'svg-inline--fa fa-angle-down fa-w-10', '0 0 320 512', 'M143 352.3L7 216.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0l96.4 96.4 96.4-96.4c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.2 9.4-24.4 9.4-33.8 0z'));
var lattyware$elm_fontawesome$FontAwesome$Solid$angleRight = lattyware$elm_fontawesome$FontAwesome$Icon$view(
	A5(lattyware$elm_fontawesome$FontAwesome$Icon$Icon, 'fas', 'angle-right', 'svg-inline--fa fa-angle-right fa-w-8', '0 0 256 512', 'M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z'));
var author$project$Main$viewHullSlicesDetails = F3(
	function (uiState, hullReference, hullslices) {
		return A2(
			elm$html$Html$div,
			_List_fromArray(
				[
					elm$html$Html$Attributes$class('slices-details')
				]),
			A2(author$project$Main$isAccordionOpened, uiState, 'hull-slices-details') ? _List_fromArray(
				[
					A2(
					elm$html$Html$p,
					_List_fromArray(
						[
							elm$html$Html$Attributes$class('slices-details-title'),
							elm$html$Html$Events$onClick(
							author$project$Main$ToJs(
								A2(author$project$Main$ToggleSlicesDetails, false, hullReference)))
						]),
					_List_fromArray(
						[
							elm$html$Html$text('Slices details'),
							lattyware$elm_fontawesome$FontAwesome$Solid$angleDown(_List_Nil)
						])),
					A3(author$project$Main$viewHullSliceSelector, uiState, hullReference, hullslices.slices),
					A2(author$project$Main$viewHullSliceList, hullslices, uiState.selectedSlice.value)
				]) : _List_fromArray(
				[
					A2(
					elm$html$Html$p,
					_List_fromArray(
						[
							elm$html$Html$Attributes$class('slices-details-title'),
							elm$html$Html$Events$onClick(
							author$project$Main$ToJs(
								A2(author$project$Main$ToggleSlicesDetails, true, hullReference)))
						]),
					_List_fromArray(
						[
							elm$html$Html$text('Slices details'),
							lattyware$elm_fontawesome$FontAwesome$Solid$angleRight(_List_Nil)
						]))
				]));
	});
var elm$html$Html$h5 = _VirtualDom_node('h5');
var author$project$Main$viewModellerSimpleKpi = F3(
	function (kpiTitle, className, totalValue) {
		return A2(
			elm$html$Html$div,
			_List_fromArray(
				[
					elm$html$Html$Attributes$class('kpi ' + className)
				]),
			_List_fromArray(
				[
					A2(
					elm$html$Html$div,
					_List_fromArray(
						[
							elm$html$Html$Attributes$class('kpi-total kpi-group')
						]),
					_List_fromArray(
						[
							A2(
							elm$html$Html$h5,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('kpi-modeller-label')
								]),
							_List_fromArray(
								[
									elm$html$Html$text(kpiTitle)
								])),
							A2(
							elm$html$Html$p,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('kpi-modeller-value')
								]),
							_List_fromArray(
								[
									elm$html$Html$text(
									elm$core$String$fromFloat(totalValue))
								]))
						]))
				]));
	});
var NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$requiredAt = F3(
	function (path, valDecoder, decoder) {
		return A2(
			NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom,
			A2(elm$json$Json$Decode$at, path, valDecoder),
			decoder);
	});
var author$project$ExtraEvents$KeyEvent = F5(
	function (key, shift, alt, ctrl, targetValue) {
		return {alt: alt, ctrl: ctrl, key: key, shift: shift, targetValue: targetValue};
	});
var author$project$ExtraEvents$isKeyArrowDown = function (keyEvent) {
	return keyEvent.key === 40;
};
var author$project$ExtraEvents$isKeyArrowUp = function (keyEvent) {
	return keyEvent.key === 38;
};
var author$project$ExtraEvents$toIncrement = F2(
	function (nbOfDigits, keyEvent) {
		var magnitude = (keyEvent.shift && (!keyEvent.alt)) ? A2(elm$core$Basics$pow, 10, 2 - nbOfDigits) : ((keyEvent.alt && (!keyEvent.shift)) ? A2(elm$core$Basics$pow, 10, 0 - nbOfDigits) : A2(elm$core$Basics$pow, 10, 1 - nbOfDigits));
		return author$project$ExtraEvents$isKeyArrowUp(keyEvent) ? elm$core$Maybe$Just(magnitude) : (author$project$ExtraEvents$isKeyArrowDown(keyEvent) ? elm$core$Maybe$Just((-1) * magnitude) : elm$core$Maybe$Nothing);
	});
var author$project$ExtraEvents$keyEventDecoder = F2(
	function (nbOfDigits, currentValue) {
		var convertToString = function (keyEvent) {
			var _n0 = A2(author$project$ExtraEvents$toIncrement, nbOfDigits, keyEvent);
			if (_n0.$ === 'Nothing') {
				return keyEvent.targetValue;
			} else {
				var inc = _n0.a;
				var _n1 = elm$core$String$toFloat(currentValue);
				if (_n1.$ === 'Nothing') {
					return keyEvent.targetValue;
				} else {
					var val = _n1.a;
					return elm$core$String$fromFloat(val + inc);
				}
			}
		};
		return A2(
			elm$json$Json$Decode$map,
			convertToString,
			A3(
				NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$requiredAt,
				_List_fromArray(
					['target', 'value']),
				elm$json$Json$Decode$string,
				A3(
					NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
					'ctrlKey',
					elm$json$Json$Decode$bool,
					A3(
						NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
						'altKey',
						elm$json$Json$Decode$bool,
						A3(
							NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
							'shiftKey',
							elm$json$Json$Decode$bool,
							A3(
								NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
								'keyCode',
								elm$json$Json$Decode$int,
								elm$json$Json$Decode$succeed(author$project$ExtraEvents$KeyEvent)))))));
	});
var author$project$ExtraEvents$onKeyDown = F3(
	function (nbOfDigits, currentValue, onValueChange) {
		return A2(
			elm$html$Html$Events$on,
			'keydown',
			A2(
				elm$json$Json$Decode$map,
				onValueChange,
				A2(author$project$ExtraEvents$keyEventDecoder, nbOfDigits, currentValue)));
	});
var author$project$StringValueInput$view = F2(
	function (floatInput_, onChange) {
		var generatedID = author$project$StringValueInput$makeID(floatInput_.description);
		return A2(
			elm$html$Html$div,
			_List_fromArray(
				[
					elm$html$Html$Attributes$class('input-group')
				]),
			_List_fromArray(
				[
					A2(
					elm$html$Html$label,
					_List_fromArray(
						[
							elm$html$Html$Attributes$for(generatedID)
						]),
					_List_fromArray(
						[
							elm$html$Html$text(floatInput_.description + (' (' + (floatInput_.unit + ')')))
						])),
					A2(
					elm$html$Html$input,
					_List_fromArray(
						[
							elm$html$Html$Attributes$type_('text'),
							elm$html$Html$Attributes$id(generatedID),
							elm$html$Html$Attributes$value(floatInput_.string),
							A3(author$project$ExtraEvents$onKeyDown, floatInput_.nbOfDigits, floatInput_.string, onChange),
							elm$html$Html$Events$onInput(onChange)
						]),
					_List_Nil)
				]));
	});
var elm$html$Html$br = _VirtualDom_node('br');
var author$project$Main$viewModeller = function (model) {
	var viewSlices = function (_n1) {
		var hullReference = _n1.a;
		var slices = _n1.b;
		var hullSlicesMetrics = author$project$HullSlicesMetrics$fillHullSliceMetrics(slices);
		return _Utils_eq(
			model.selectedHullReference,
			elm$core$Maybe$Just(hullReference)) ? elm$core$Maybe$Just(
			A2(
				elm$html$Html$div,
				_List_fromArray(
					[
						elm$html$Html$Attributes$id('slices-inputs')
					]),
				_List_fromArray(
					[
						A3(
						elm$core$Basics$apL,
						author$project$StringValueInput$view,
						author$project$HullSlices$getLength(slices),
						A2(
							elm$core$Basics$composeL,
							author$project$Main$ToJs,
							A2(author$project$Main$ModifySlice, author$project$HullSliceModifiers$setLengthOverAll, hullReference))),
						A3(
						elm$core$Basics$apL,
						author$project$StringValueInput$view,
						author$project$HullSlices$getBreadth(slices),
						A2(
							elm$core$Basics$composeL,
							author$project$Main$ToJs,
							A2(author$project$Main$ModifySlice, author$project$HullSliceModifiers$setBreadth, hullReference))),
						A3(
						elm$core$Basics$apL,
						author$project$StringValueInput$view,
						author$project$HullSlices$getDepth(slices),
						A2(
							elm$core$Basics$composeL,
							author$project$Main$ToJs,
							A2(author$project$Main$ModifySlice, author$project$HullSliceModifiers$setDepth, hullReference))),
						A3(
						elm$core$Basics$apL,
						author$project$StringValueInput$view,
						author$project$HullSlices$getDraught(slices),
						A2(
							elm$core$Basics$composeL,
							author$project$Main$ToJs,
							A2(author$project$Main$ModifySlice, author$project$HullSliceModifiers$setDraught, hullReference))),
						A3(
						elm$core$Basics$apL,
						author$project$StringValueInput$view,
						author$project$HullSlicesMetrics$getPrismaticCoefficient(hullSlicesMetrics),
						A2(
							elm$core$Basics$composeL,
							author$project$Main$ToJs,
							A2(author$project$Main$ModifySlice, author$project$HullSliceModifiers$setPrismaticCoefficient, hullReference))),
						A3(author$project$Main$viewHullSlicesDetails, model.uiState, hullReference, slices),
						A2(
						elm$html$Html$div,
						_List_fromArray(
							[
								elm$html$Html$Attributes$id('hydrocalc')
							]),
						_List_fromArray(
							[
								A2(
								elm$html$Html$div,
								_List_fromArray(
									[
										elm$html$Html$Attributes$id('disclaimer'),
										elm$html$Html$Attributes$class('disclaimer')
									]),
								_List_fromArray(
									[
										elm$html$Html$text('Hull models are approximate'),
										A2(elm$html$Html$br, _List_Nil, _List_Nil),
										elm$html$Html$text('The values below are given for information only')
									])),
								A2(elm$html$Html$br, _List_Nil, _List_Nil),
								author$project$AreaCurve$view(hullSlicesMetrics),
								A3(
								author$project$Main$viewModellerSimpleKpi,
								'Displacement (m3)',
								'displacement',
								A2(
									author$project$StringValueInput$round_n,
									-1,
									author$project$HullSlicesMetrics$getDisplacement(hullSlicesMetrics))),
								A3(
								author$project$Main$viewModellerSimpleKpi,
								'Block Coefficient Cb',
								'block-coefficient',
								A2(
									author$project$StringValueInput$round_n,
									2,
									author$project$HullSlicesMetrics$getBlockCoefficient(hullSlicesMetrics))),
								A3(
								author$project$Main$viewModellerSimpleKpi,
								'KB',
								'KB',
								A2(
									author$project$StringValueInput$round_n,
									1,
									author$project$HullSlicesMetrics$getCenterOfBuoyancy(hullSlicesMetrics))),
								A3(
								author$project$Main$viewModellerSimpleKpi,
								'KM',
								'KM',
								A2(
									author$project$StringValueInput$round_n,
									1,
									author$project$HullSlicesMetrics$getMetacentre(hullSlicesMetrics))),
								A2(
								elm$html$Html$button,
								_List_fromArray(
									[
										elm$html$Html$Attributes$id('exportCSV'),
										elm$html$Html$Attributes$value('exportCSV'),
										elm$html$Html$Events$onClick(
										author$project$Main$ToJs(
											author$project$Main$ExportCSV(hullReference)))
									]),
								_List_fromArray(
									[
										elm$html$Html$text('export decks (csv)')
									])),
								A2(
								elm$html$Html$button,
								_List_fromArray(
									[
										elm$html$Html$Attributes$id('exportSTL'),
										elm$html$Html$Attributes$value('exportSTL'),
										elm$html$Html$Events$onClick(
										author$project$Main$ToJs(
											author$project$Main$ExportSTL(hullReference)))
									]),
								_List_fromArray(
									[
										elm$html$Html$text('export 3D (stl)')
									]))
							]))
					]))) : elm$core$Maybe$Nothing;
	};
	var modellerName = function () {
		var _n0 = model.selectedHullReference;
		if (_n0.$ === 'Just') {
			var hullname = _n0.a;
			return 'Modelling ' + hullname;
		} else {
			return 'No hull selected';
		}
	}();
	return A2(
		elm$html$Html$div,
		_List_fromArray(
			[
				elm$html$Html$Attributes$class('panel modeller-panel')
			]),
		A2(
			elm$core$List$cons,
			A2(
				elm$html$Html$h2,
				_List_fromArray(
					[
						elm$html$Html$Attributes$class('modeller-panel-title')
					]),
				_List_fromArray(
					[
						A2(
						elm$html$Html$div,
						_List_fromArray(
							[
								elm$html$Html$Attributes$class('modeller-name')
							]),
						_List_fromArray(
							[
								author$project$Main$viewBackToHullList,
								elm$html$Html$text(modellerName)
							])),
						A2(
						elm$html$Html$div,
						_List_fromArray(
							[
								elm$html$Html$Attributes$class('modeller-actions')
							]),
						_List_fromArray(
							[
								author$project$Main$resetHullSlices(model)
							]))
					])),
			A2(
				elm$core$List$filterMap,
				viewSlices,
				elm$core$Dict$toList(model.slices))));
};
var author$project$Main$viewHullPanel = F2(
	function (hullview, model) {
		if (hullview.$ === 'HullLibrary') {
			return author$project$Main$viewHullLibraryPanel(model);
		} else {
			return author$project$Main$viewModeller(model);
		}
	});
var author$project$Main$getBlockBoundingBox = function (block) {
	return {
		max: {x: block.position.x.value + block.size.length.value, y: block.position.y.value + block.size.width.value, z: block.position.z.value - block.size.height.value},
		min: {x: block.position.x.value, y: block.position.y.value, z: block.position.z.value}
	};
};
var author$project$Main$getBlocksBoundingBox = function (blocks) {
	var boundingBoxList = A2(
		elm$core$List$map,
		author$project$Main$getBlockBoundingBox,
		author$project$Main$toList(blocks));
	return A3(
		elm$core$List$foldl,
		F2(
			function (a, b) {
				return {
					max: {
						x: (_Utils_cmp(a.max.x, b.max.x) > 0) ? a.max.x : b.max.x,
						y: (_Utils_cmp(a.max.y, b.max.y) > 0) ? a.max.y : b.max.y,
						z: (_Utils_cmp(a.max.z, b.max.z) < 0) ? a.max.z : b.max.z
					},
					min: {
						x: (_Utils_cmp(a.min.x, b.min.x) < 0) ? a.min.x : b.min.x,
						y: (_Utils_cmp(a.min.y, b.min.y) < 0) ? a.min.y : b.min.y,
						z: (_Utils_cmp(a.min.z, b.min.z) > 0) ? a.min.z : b.min.z
					}
				};
			}),
		A2(
			elm$core$Maybe$withDefault,
			{
				max: {x: 0.0, y: 0.0, z: 0.0},
				min: {x: 0.0, y: 0.0, z: 0.0}
			},
			elm$core$List$head(boundingBoxList)),
		boundingBoxList);
};
var author$project$Main$getBoundingBoxSize = function (bBox) {
	return {
		height: elm$core$Basics$abs(bBox.max.z - bBox.min.z),
		length: elm$core$Basics$abs(bBox.max.x - bBox.min.x),
		width: elm$core$Basics$abs(bBox.max.y - bBox.min.y)
	};
};
var ryannhg$date_format$DateFormat$DayOfMonthNumber = {$: 'DayOfMonthNumber'};
var ryannhg$date_format$DateFormat$dayOfMonthNumber = ryannhg$date_format$DateFormat$DayOfMonthNumber;
var elm$core$String$right = F2(
	function (n, string) {
		return (n < 1) ? '' : A3(
			elm$core$String$slice,
			-n,
			elm$core$String$length(string),
			string);
	});
var elm$core$String$toUpper = _String_toUpper;
var elm$time$Time$flooredDiv = F2(
	function (numerator, denominator) {
		return elm$core$Basics$floor(numerator / denominator);
	});
var elm$time$Time$posixToMillis = function (_n0) {
	var millis = _n0.a;
	return millis;
};
var elm$time$Time$toAdjustedMinutesHelp = F3(
	function (defaultOffset, posixMinutes, eras) {
		toAdjustedMinutesHelp:
		while (true) {
			if (!eras.b) {
				return posixMinutes + defaultOffset;
			} else {
				var era = eras.a;
				var olderEras = eras.b;
				if (_Utils_cmp(era.start, posixMinutes) < 0) {
					return posixMinutes + era.offset;
				} else {
					var $temp$defaultOffset = defaultOffset,
						$temp$posixMinutes = posixMinutes,
						$temp$eras = olderEras;
					defaultOffset = $temp$defaultOffset;
					posixMinutes = $temp$posixMinutes;
					eras = $temp$eras;
					continue toAdjustedMinutesHelp;
				}
			}
		}
	});
var elm$time$Time$toAdjustedMinutes = F2(
	function (_n0, time) {
		var defaultOffset = _n0.a;
		var eras = _n0.b;
		return A3(
			elm$time$Time$toAdjustedMinutesHelp,
			defaultOffset,
			A2(
				elm$time$Time$flooredDiv,
				elm$time$Time$posixToMillis(time),
				60000),
			eras);
	});
var elm$time$Time$toHour = F2(
	function (zone, time) {
		return A2(
			elm$core$Basics$modBy,
			24,
			A2(
				elm$time$Time$flooredDiv,
				A2(elm$time$Time$toAdjustedMinutes, zone, time),
				60));
	});
var elm$time$Time$toMillis = F2(
	function (_n0, time) {
		return A2(
			elm$core$Basics$modBy,
			1000,
			elm$time$Time$posixToMillis(time));
	});
var elm$time$Time$toMinute = F2(
	function (zone, time) {
		return A2(
			elm$core$Basics$modBy,
			60,
			A2(elm$time$Time$toAdjustedMinutes, zone, time));
	});
var elm$time$Time$Apr = {$: 'Apr'};
var elm$time$Time$Aug = {$: 'Aug'};
var elm$time$Time$Dec = {$: 'Dec'};
var elm$time$Time$Feb = {$: 'Feb'};
var elm$time$Time$Jan = {$: 'Jan'};
var elm$time$Time$Jul = {$: 'Jul'};
var elm$time$Time$Jun = {$: 'Jun'};
var elm$time$Time$Mar = {$: 'Mar'};
var elm$time$Time$May = {$: 'May'};
var elm$time$Time$Nov = {$: 'Nov'};
var elm$time$Time$Oct = {$: 'Oct'};
var elm$time$Time$Sep = {$: 'Sep'};
var elm$time$Time$toCivil = function (minutes) {
	var rawDay = A2(elm$time$Time$flooredDiv, minutes, 60 * 24) + 719468;
	var era = (((rawDay >= 0) ? rawDay : (rawDay - 146096)) / 146097) | 0;
	var dayOfEra = rawDay - (era * 146097);
	var yearOfEra = ((((dayOfEra - ((dayOfEra / 1460) | 0)) + ((dayOfEra / 36524) | 0)) - ((dayOfEra / 146096) | 0)) / 365) | 0;
	var dayOfYear = dayOfEra - (((365 * yearOfEra) + ((yearOfEra / 4) | 0)) - ((yearOfEra / 100) | 0));
	var mp = (((5 * dayOfYear) + 2) / 153) | 0;
	var month = mp + ((mp < 10) ? 3 : (-9));
	var year = yearOfEra + (era * 400);
	return {
		day: (dayOfYear - ((((153 * mp) + 2) / 5) | 0)) + 1,
		month: month,
		year: year + ((month <= 2) ? 1 : 0)
	};
};
var elm$time$Time$toMonth = F2(
	function (zone, time) {
		var _n0 = elm$time$Time$toCivil(
			A2(elm$time$Time$toAdjustedMinutes, zone, time)).month;
		switch (_n0) {
			case 1:
				return elm$time$Time$Jan;
			case 2:
				return elm$time$Time$Feb;
			case 3:
				return elm$time$Time$Mar;
			case 4:
				return elm$time$Time$Apr;
			case 5:
				return elm$time$Time$May;
			case 6:
				return elm$time$Time$Jun;
			case 7:
				return elm$time$Time$Jul;
			case 8:
				return elm$time$Time$Aug;
			case 9:
				return elm$time$Time$Sep;
			case 10:
				return elm$time$Time$Oct;
			case 11:
				return elm$time$Time$Nov;
			default:
				return elm$time$Time$Dec;
		}
	});
var elm$time$Time$toSecond = F2(
	function (_n0, time) {
		return A2(
			elm$core$Basics$modBy,
			60,
			A2(
				elm$time$Time$flooredDiv,
				elm$time$Time$posixToMillis(time),
				1000));
	});
var elm$time$Time$Fri = {$: 'Fri'};
var elm$time$Time$Mon = {$: 'Mon'};
var elm$time$Time$Sat = {$: 'Sat'};
var elm$time$Time$Sun = {$: 'Sun'};
var elm$time$Time$Thu = {$: 'Thu'};
var elm$time$Time$Tue = {$: 'Tue'};
var elm$time$Time$Wed = {$: 'Wed'};
var elm$time$Time$toWeekday = F2(
	function (zone, time) {
		var _n0 = A2(
			elm$core$Basics$modBy,
			7,
			A2(
				elm$time$Time$flooredDiv,
				A2(elm$time$Time$toAdjustedMinutes, zone, time),
				60 * 24));
		switch (_n0) {
			case 0:
				return elm$time$Time$Thu;
			case 1:
				return elm$time$Time$Fri;
			case 2:
				return elm$time$Time$Sat;
			case 3:
				return elm$time$Time$Sun;
			case 4:
				return elm$time$Time$Mon;
			case 5:
				return elm$time$Time$Tue;
			default:
				return elm$time$Time$Wed;
		}
	});
var ryannhg$date_format$DateFormat$amPm = F3(
	function (language, zone, posix) {
		return language.toAmPm(
			A2(elm$time$Time$toHour, zone, posix));
	});
var elm$time$Time$toDay = F2(
	function (zone, time) {
		return elm$time$Time$toCivil(
			A2(elm$time$Time$toAdjustedMinutes, zone, time)).day;
	});
var ryannhg$date_format$DateFormat$dayOfMonth = elm$time$Time$toDay;
var ryannhg$date_format$DateFormat$days = _List_fromArray(
	[elm$time$Time$Sun, elm$time$Time$Mon, elm$time$Time$Tue, elm$time$Time$Wed, elm$time$Time$Thu, elm$time$Time$Fri, elm$time$Time$Sat]);
var ryannhg$date_format$DateFormat$dayOfWeek = F2(
	function (zone, posix) {
		return function (_n1) {
			var i = _n1.a;
			return i;
		}(
			A2(
				elm$core$Maybe$withDefault,
				_Utils_Tuple2(0, elm$time$Time$Sun),
				elm$core$List$head(
					A2(
						elm$core$List$filter,
						function (_n0) {
							var day = _n0.b;
							return _Utils_eq(
								day,
								A2(elm$time$Time$toWeekday, zone, posix));
						},
						A2(
							elm$core$List$indexedMap,
							F2(
								function (i, day) {
									return _Utils_Tuple2(i, day);
								}),
							ryannhg$date_format$DateFormat$days)))));
	});
var elm$time$Time$toYear = F2(
	function (zone, time) {
		return elm$time$Time$toCivil(
			A2(elm$time$Time$toAdjustedMinutes, zone, time)).year;
	});
var ryannhg$date_format$DateFormat$isLeapYear = function (year_) {
	return A2(elm$core$Basics$modBy, 4, year_) ? false : (A2(elm$core$Basics$modBy, 100, year_) ? true : (A2(elm$core$Basics$modBy, 400, year_) ? false : true));
};
var ryannhg$date_format$DateFormat$daysInMonth = F2(
	function (year_, month) {
		switch (month.$) {
			case 'Jan':
				return 31;
			case 'Feb':
				return ryannhg$date_format$DateFormat$isLeapYear(year_) ? 29 : 28;
			case 'Mar':
				return 31;
			case 'Apr':
				return 30;
			case 'May':
				return 31;
			case 'Jun':
				return 30;
			case 'Jul':
				return 31;
			case 'Aug':
				return 31;
			case 'Sep':
				return 30;
			case 'Oct':
				return 31;
			case 'Nov':
				return 30;
			default:
				return 31;
		}
	});
var ryannhg$date_format$DateFormat$months = _List_fromArray(
	[elm$time$Time$Jan, elm$time$Time$Feb, elm$time$Time$Mar, elm$time$Time$Apr, elm$time$Time$May, elm$time$Time$Jun, elm$time$Time$Jul, elm$time$Time$Aug, elm$time$Time$Sep, elm$time$Time$Oct, elm$time$Time$Nov, elm$time$Time$Dec]);
var ryannhg$date_format$DateFormat$monthPair = F2(
	function (zone, posix) {
		return A2(
			elm$core$Maybe$withDefault,
			_Utils_Tuple2(0, elm$time$Time$Jan),
			elm$core$List$head(
				A2(
					elm$core$List$filter,
					function (_n0) {
						var i = _n0.a;
						var m = _n0.b;
						return _Utils_eq(
							m,
							A2(elm$time$Time$toMonth, zone, posix));
					},
					A2(
						elm$core$List$indexedMap,
						F2(
							function (a, b) {
								return _Utils_Tuple2(a, b);
							}),
						ryannhg$date_format$DateFormat$months))));
	});
var ryannhg$date_format$DateFormat$monthNumber_ = F2(
	function (zone, posix) {
		return 1 + function (_n0) {
			var i = _n0.a;
			var m = _n0.b;
			return i;
		}(
			A2(ryannhg$date_format$DateFormat$monthPair, zone, posix));
	});
var ryannhg$date_format$DateFormat$dayOfYear = F2(
	function (zone, posix) {
		var monthsBeforeThisOne = A2(
			elm$core$List$take,
			A2(ryannhg$date_format$DateFormat$monthNumber_, zone, posix) - 1,
			ryannhg$date_format$DateFormat$months);
		var daysBeforeThisMonth = elm$core$List$sum(
			A2(
				elm$core$List$map,
				ryannhg$date_format$DateFormat$daysInMonth(
					A2(elm$time$Time$toYear, zone, posix)),
				monthsBeforeThisOne));
		return daysBeforeThisMonth + A2(ryannhg$date_format$DateFormat$dayOfMonth, zone, posix);
	});
var ryannhg$date_format$DateFormat$quarter = F2(
	function (zone, posix) {
		return (A2(ryannhg$date_format$DateFormat$monthNumber_, zone, posix) / 4) | 0;
	});
var ryannhg$date_format$DateFormat$toFixedLength = F2(
	function (totalChars, num) {
		var numStr = elm$core$String$fromInt(num);
		var numZerosNeeded = totalChars - elm$core$String$length(numStr);
		var zeros = A2(
			elm$core$String$join,
			'',
			A2(
				elm$core$List$map,
				function (_n0) {
					return '0';
				},
				A2(elm$core$List$range, 1, numZerosNeeded)));
		return _Utils_ap(zeros, numStr);
	});
var ryannhg$date_format$DateFormat$toNonMilitary = function (num) {
	return (!num) ? 12 : ((num <= 12) ? num : (num - 12));
};
var ryannhg$date_format$DateFormat$millisecondsPerYear = elm$core$Basics$round((((1000 * 60) * 60) * 24) * 365.25);
var ryannhg$date_format$DateFormat$firstDayOfYear = F2(
	function (zone, time) {
		return elm$time$Time$millisToPosix(
			ryannhg$date_format$DateFormat$millisecondsPerYear * A2(elm$time$Time$toYear, zone, time));
	});
var ryannhg$date_format$DateFormat$weekOfYear = F2(
	function (zone, posix) {
		var firstDay = A2(ryannhg$date_format$DateFormat$firstDayOfYear, zone, posix);
		var firstDayOffset = A2(ryannhg$date_format$DateFormat$dayOfWeek, zone, firstDay);
		var daysSoFar = A2(ryannhg$date_format$DateFormat$dayOfYear, zone, posix);
		return (((daysSoFar + firstDayOffset) / 7) | 0) + 1;
	});
var ryannhg$date_format$DateFormat$year = F2(
	function (zone, time) {
		return elm$core$String$fromInt(
			A2(elm$time$Time$toYear, zone, time));
	});
var ryannhg$date_format$DateFormat$piece = F4(
	function (language, zone, posix, token) {
		switch (token.$) {
			case 'MonthNumber':
				return elm$core$String$fromInt(
					A2(ryannhg$date_format$DateFormat$monthNumber_, zone, posix));
			case 'MonthSuffix':
				return function (num) {
					return _Utils_ap(
						elm$core$String$fromInt(num),
						language.toOrdinalSuffix(num));
				}(
					A2(ryannhg$date_format$DateFormat$monthNumber_, zone, posix));
			case 'MonthFixed':
				return A2(
					ryannhg$date_format$DateFormat$toFixedLength,
					2,
					A2(ryannhg$date_format$DateFormat$monthNumber_, zone, posix));
			case 'MonthNameAbbreviated':
				return language.toMonthAbbreviation(
					A2(elm$time$Time$toMonth, zone, posix));
			case 'MonthNameFull':
				return language.toMonthName(
					A2(elm$time$Time$toMonth, zone, posix));
			case 'QuarterNumber':
				return elm$core$String$fromInt(
					1 + A2(ryannhg$date_format$DateFormat$quarter, zone, posix));
			case 'QuarterSuffix':
				return function (num) {
					return _Utils_ap(
						elm$core$String$fromInt(num),
						language.toOrdinalSuffix(num));
				}(
					1 + A2(ryannhg$date_format$DateFormat$quarter, zone, posix));
			case 'DayOfMonthNumber':
				return elm$core$String$fromInt(
					A2(ryannhg$date_format$DateFormat$dayOfMonth, zone, posix));
			case 'DayOfMonthSuffix':
				return function (num) {
					return _Utils_ap(
						elm$core$String$fromInt(num),
						language.toOrdinalSuffix(num));
				}(
					A2(ryannhg$date_format$DateFormat$dayOfMonth, zone, posix));
			case 'DayOfMonthFixed':
				return A2(
					ryannhg$date_format$DateFormat$toFixedLength,
					2,
					A2(ryannhg$date_format$DateFormat$dayOfMonth, zone, posix));
			case 'DayOfYearNumber':
				return elm$core$String$fromInt(
					A2(ryannhg$date_format$DateFormat$dayOfYear, zone, posix));
			case 'DayOfYearSuffix':
				return function (num) {
					return _Utils_ap(
						elm$core$String$fromInt(num),
						language.toOrdinalSuffix(num));
				}(
					A2(ryannhg$date_format$DateFormat$dayOfYear, zone, posix));
			case 'DayOfYearFixed':
				return A2(
					ryannhg$date_format$DateFormat$toFixedLength,
					3,
					A2(ryannhg$date_format$DateFormat$dayOfYear, zone, posix));
			case 'DayOfWeekNumber':
				return elm$core$String$fromInt(
					A2(ryannhg$date_format$DateFormat$dayOfWeek, zone, posix));
			case 'DayOfWeekSuffix':
				return function (num) {
					return _Utils_ap(
						elm$core$String$fromInt(num),
						language.toOrdinalSuffix(num));
				}(
					A2(ryannhg$date_format$DateFormat$dayOfWeek, zone, posix));
			case 'DayOfWeekNameAbbreviated':
				return language.toWeekdayAbbreviation(
					A2(elm$time$Time$toWeekday, zone, posix));
			case 'DayOfWeekNameFull':
				return language.toWeekdayName(
					A2(elm$time$Time$toWeekday, zone, posix));
			case 'WeekOfYearNumber':
				return elm$core$String$fromInt(
					A2(ryannhg$date_format$DateFormat$weekOfYear, zone, posix));
			case 'WeekOfYearSuffix':
				return function (num) {
					return _Utils_ap(
						elm$core$String$fromInt(num),
						language.toOrdinalSuffix(num));
				}(
					A2(ryannhg$date_format$DateFormat$weekOfYear, zone, posix));
			case 'WeekOfYearFixed':
				return A2(
					ryannhg$date_format$DateFormat$toFixedLength,
					2,
					A2(ryannhg$date_format$DateFormat$weekOfYear, zone, posix));
			case 'YearNumberLastTwo':
				return A2(
					elm$core$String$right,
					2,
					A2(ryannhg$date_format$DateFormat$year, zone, posix));
			case 'YearNumber':
				return A2(ryannhg$date_format$DateFormat$year, zone, posix);
			case 'AmPmUppercase':
				return elm$core$String$toUpper(
					A3(ryannhg$date_format$DateFormat$amPm, language, zone, posix));
			case 'AmPmLowercase':
				return elm$core$String$toLower(
					A3(ryannhg$date_format$DateFormat$amPm, language, zone, posix));
			case 'HourMilitaryNumber':
				return elm$core$String$fromInt(
					A2(elm$time$Time$toHour, zone, posix));
			case 'HourMilitaryFixed':
				return A2(
					ryannhg$date_format$DateFormat$toFixedLength,
					2,
					A2(elm$time$Time$toHour, zone, posix));
			case 'HourNumber':
				return elm$core$String$fromInt(
					ryannhg$date_format$DateFormat$toNonMilitary(
						A2(elm$time$Time$toHour, zone, posix)));
			case 'HourFixed':
				return A2(
					ryannhg$date_format$DateFormat$toFixedLength,
					2,
					ryannhg$date_format$DateFormat$toNonMilitary(
						A2(elm$time$Time$toHour, zone, posix)));
			case 'HourMilitaryFromOneNumber':
				return elm$core$String$fromInt(
					1 + A2(elm$time$Time$toHour, zone, posix));
			case 'HourMilitaryFromOneFixed':
				return A2(
					ryannhg$date_format$DateFormat$toFixedLength,
					2,
					1 + A2(elm$time$Time$toHour, zone, posix));
			case 'MinuteNumber':
				return elm$core$String$fromInt(
					A2(elm$time$Time$toMinute, zone, posix));
			case 'MinuteFixed':
				return A2(
					ryannhg$date_format$DateFormat$toFixedLength,
					2,
					A2(elm$time$Time$toMinute, zone, posix));
			case 'SecondNumber':
				return elm$core$String$fromInt(
					A2(elm$time$Time$toSecond, zone, posix));
			case 'SecondFixed':
				return A2(
					ryannhg$date_format$DateFormat$toFixedLength,
					2,
					A2(elm$time$Time$toSecond, zone, posix));
			case 'MillisecondNumber':
				return elm$core$String$fromInt(
					A2(elm$time$Time$toMillis, zone, posix));
			case 'MillisecondFixed':
				return A2(
					ryannhg$date_format$DateFormat$toFixedLength,
					3,
					A2(elm$time$Time$toMillis, zone, posix));
			default:
				var string = token.a;
				return string;
		}
	});
var ryannhg$date_format$DateFormat$formatWithLanguage = F4(
	function (language, tokens, zone, time) {
		return A2(
			elm$core$String$join,
			'',
			A2(
				elm$core$List$map,
				A3(ryannhg$date_format$DateFormat$piece, language, zone, time),
				tokens));
	});
var ryannhg$date_format$DateFormat$Language$Language = F6(
	function (toMonthName, toMonthAbbreviation, toWeekdayName, toWeekdayAbbreviation, toAmPm, toOrdinalSuffix) {
		return {toAmPm: toAmPm, toMonthAbbreviation: toMonthAbbreviation, toMonthName: toMonthName, toOrdinalSuffix: toOrdinalSuffix, toWeekdayAbbreviation: toWeekdayAbbreviation, toWeekdayName: toWeekdayName};
	});
var ryannhg$date_format$DateFormat$Language$toEnglishAmPm = function (hour) {
	return (hour > 11) ? 'pm' : 'am';
};
var ryannhg$date_format$DateFormat$Language$toEnglishMonthName = function (month) {
	switch (month.$) {
		case 'Jan':
			return 'January';
		case 'Feb':
			return 'February';
		case 'Mar':
			return 'March';
		case 'Apr':
			return 'April';
		case 'May':
			return 'May';
		case 'Jun':
			return 'June';
		case 'Jul':
			return 'July';
		case 'Aug':
			return 'August';
		case 'Sep':
			return 'September';
		case 'Oct':
			return 'October';
		case 'Nov':
			return 'November';
		default:
			return 'December';
	}
};
var ryannhg$date_format$DateFormat$Language$toEnglishSuffix = function (num) {
	var _n0 = A2(elm$core$Basics$modBy, 100, num);
	switch (_n0) {
		case 11:
			return 'th';
		case 12:
			return 'th';
		case 13:
			return 'th';
		default:
			var _n1 = A2(elm$core$Basics$modBy, 10, num);
			switch (_n1) {
				case 1:
					return 'st';
				case 2:
					return 'nd';
				case 3:
					return 'rd';
				default:
					return 'th';
			}
	}
};
var ryannhg$date_format$DateFormat$Language$toEnglishWeekdayName = function (weekday) {
	switch (weekday.$) {
		case 'Mon':
			return 'Monday';
		case 'Tue':
			return 'Tuesday';
		case 'Wed':
			return 'Wednesday';
		case 'Thu':
			return 'Thursday';
		case 'Fri':
			return 'Friday';
		case 'Sat':
			return 'Saturday';
		default:
			return 'Sunday';
	}
};
var ryannhg$date_format$DateFormat$Language$english = A6(
	ryannhg$date_format$DateFormat$Language$Language,
	ryannhg$date_format$DateFormat$Language$toEnglishMonthName,
	A2(
		elm$core$Basics$composeR,
		ryannhg$date_format$DateFormat$Language$toEnglishMonthName,
		elm$core$String$left(3)),
	ryannhg$date_format$DateFormat$Language$toEnglishWeekdayName,
	A2(
		elm$core$Basics$composeR,
		ryannhg$date_format$DateFormat$Language$toEnglishWeekdayName,
		elm$core$String$left(3)),
	ryannhg$date_format$DateFormat$Language$toEnglishAmPm,
	ryannhg$date_format$DateFormat$Language$toEnglishSuffix);
var ryannhg$date_format$DateFormat$format = ryannhg$date_format$DateFormat$formatWithLanguage(ryannhg$date_format$DateFormat$Language$english);
var ryannhg$date_format$DateFormat$HourMilitaryFixed = {$: 'HourMilitaryFixed'};
var ryannhg$date_format$DateFormat$hourMilitaryFixed = ryannhg$date_format$DateFormat$HourMilitaryFixed;
var ryannhg$date_format$DateFormat$MinuteFixed = {$: 'MinuteFixed'};
var ryannhg$date_format$DateFormat$minuteFixed = ryannhg$date_format$DateFormat$MinuteFixed;
var ryannhg$date_format$DateFormat$Text = function (a) {
	return {$: 'Text', a: a};
};
var ryannhg$date_format$DateFormat$text = ryannhg$date_format$DateFormat$Text;
var ryannhg$date_format$DateFormat$YearNumber = {$: 'YearNumber'};
var ryannhg$date_format$DateFormat$yearNumber = ryannhg$date_format$DateFormat$YearNumber;
var author$project$Main$dateFormatter = ryannhg$date_format$DateFormat$format(
	_List_fromArray(
		[
			ryannhg$date_format$DateFormat$yearNumber,
			ryannhg$date_format$DateFormat$dayOfMonthNumber,
			ryannhg$date_format$DateFormat$text('-'),
			ryannhg$date_format$DateFormat$hourMilitaryFixed,
			ryannhg$date_format$DateFormat$minuteFixed
		]));
var elm$time$Time$utc = A2(elm$time$Time$Zone, 0, _List_Nil);
var author$project$Main$getDateForFilename = function (dateSha) {
	return A2(author$project$Main$dateFormatter, elm$time$Time$utc, dateSha.currentDate);
};
var author$project$Main$WholeShip = {$: 'WholeShip'};
var author$project$Main$toVolumeList = function (blocks) {
	return A2(
		elm$core$List$map,
		author$project$Main$computeVolume,
		author$project$Main$toList(blocks));
};
var author$project$Main$getSumOfVolumes = function (blocks) {
	return elm$core$List$sum(
		author$project$Main$toVolumeList(blocks));
};
var author$project$Main$computeKpisForAll = function (blocks) {
	return {
		mass: author$project$Main$getSumOfMasses(blocks),
		target: author$project$Main$WholeShip,
		volume: author$project$Main$getSumOfVolumes(blocks)
	};
};
var author$project$Main$ColorGroup = function (a) {
	return {$: 'ColorGroup', a: a};
};
var author$project$AllDictList$getOrd = function (_n0) {
	var dict = _n0.a;
	return author$project$Dict$Any$getOrd(dict);
};
var author$project$AllDictList$emptyWithOrdFrom = A2(elm$core$Basics$composeL, author$project$AllDictList$empty, author$project$AllDictList$getOrd);
var author$project$AllDictList$unsafeGet = F3(
	function (_default, key, dict) {
		var _n0 = A2(author$project$Dict$Any$get, key, dict);
		if (_n0.$ === 'Just') {
			var value = _n0.a;
			return value;
		} else {
			return _default;
		}
	});
var author$project$AllDictList$foldl = F4(
	function (_default, func, accum, _n0) {
		var dict = _n0.a;
		var list = _n0.b;
		var go = F2(
			function (key, acc) {
				return A3(
					func,
					key,
					A3(author$project$AllDictList$unsafeGet, _default, key, dict),
					acc);
			});
		return A3(elm$core$List$foldl, go, accum, list);
	});
var author$project$AllDictList$filter = F3(
	function (_default, predicate, dictList) {
		var add = F3(
			function (key, value, dict) {
				return A2(predicate, key, value) ? A3(author$project$AllDictList$insert, key, value, dict) : dict;
			});
		return A4(
			author$project$AllDictList$foldl,
			_default,
			add,
			author$project$AllDictList$emptyWithOrdFrom(dictList),
			dictList);
	});
var author$project$DictList$filter = author$project$AllDictList$filter;
var avh4$elm_color$Color$red = A4(avh4$elm_color$Color$RgbaSpace, 204 / 255, 0 / 255, 0 / 255, 1.0);
var author$project$Main$emptyBlock = function () {
	var emptyFloat = author$project$StringValueInput$emptyFloat(1);
	return {
		centerOfGravity: {
			x: author$project$StringValueInput$emptyFloat(1),
			y: author$project$StringValueInput$emptyFloat(1),
			z: author$project$StringValueInput$emptyFloat(1)
		},
		centerOfGravityFixed: false,
		color: avh4$elm_color$Color$red,
		density: author$project$StringValueInput$emptyFloat(1),
		label: '',
		mass: author$project$StringValueInput$emptyFloat(1),
		position: {
			x: _Utils_update(
				emptyFloat,
				{description: 'x'}),
			y: _Utils_update(
				emptyFloat,
				{description: 'y'}),
			z: _Utils_update(
				emptyFloat,
				{description: 'z'})
		},
		referenceForMass: author$project$Main$None,
		size: {
			height: author$project$StringValueInput$emptyFloat(1),
			length: author$project$StringValueInput$emptyFloat(1),
			width: author$project$StringValueInput$emptyFloat(1)
		},
		uuid: '',
		visible: false
	};
}();
var author$project$Main$filterBlocksByColor = F2(
	function (color, blocks) {
		return A3(
			author$project$DictList$filter,
			author$project$Main$emptyBlock,
			F2(
				function (_n0, block) {
					return _Utils_eq(block.color, color);
				}),
			blocks);
	});
var author$project$Main$getSumOfMassesForColor = F2(
	function (blocks, color) {
		return author$project$Main$getSumOfMasses(
			A2(author$project$Main$filterBlocksByColor, color, blocks));
	});
var author$project$Main$getSumOfVolumesForColor = F2(
	function (blocks, color) {
		return author$project$Main$getSumOfVolumes(
			A2(author$project$Main$filterBlocksByColor, color, blocks));
	});
var author$project$Main$computeKpisForColor = F2(
	function (blocks, color) {
		return {
			mass: A2(
				author$project$Main$getSumOfMassesForColor,
				blocks,
				author$project$SIRColorPicker$getColor(color)),
			target: author$project$Main$ColorGroup(color),
			volume: A2(
				author$project$Main$getSumOfVolumesForColor,
				blocks,
				author$project$SIRColorPicker$getColor(color))
		};
	});
var author$project$Main$kpiSummaryToStringList = F2(
	function (tags, summary) {
		var getTagLabelForColor_ = function (sirColor) {
			return elm$core$List$head(
				A2(
					elm$core$List$map,
					function ($) {
						return $.label;
					},
					A2(
						elm$core$List$filter,
						A2(
							elm$core$Basics$composeL,
							elm$core$Basics$eq(sirColor),
							function ($) {
								return $.color;
							}),
						tags)));
		};
		var getColorName_ = function (sirColor) {
			return author$project$SIRColorPicker$getName(sirColor);
		};
		var getLabelForColor_ = function (sirColor) {
			return A2(
				elm$core$Maybe$withDefault,
				getColorName_(sirColor),
				getTagLabelForColor_(sirColor));
		};
		return _List_fromArray(
			[
				function () {
				var _n0 = summary.target;
				if (_n0.$ === 'WholeShip') {
					return 'Total';
				} else {
					var color = _n0.a;
					return getLabelForColor_(color);
				}
			}(),
				elm$core$String$fromInt(
				elm$core$Basics$round(summary.mass)),
				elm$core$String$fromFloat(
				A2(author$project$StringValueInput$round_n, 2, summary.volume))
			]);
	});
var author$project$Main$listToCsvLine = function (items) {
	return A2(
		elm$core$String$join,
		';',
		A2(
			elm$core$List$map,
			function (item) {
				return '\"' + (item + '\"');
			},
			items));
};
var author$project$Main$kpisAsCsv = F2(
	function (blocks, tags) {
		var totalSummary = author$project$Main$computeKpisForAll(blocks);
		var summaryList = A2(
			elm$core$List$map,
			author$project$Main$computeKpisForColor(blocks),
			author$project$SIRColorPicker$palette);
		var cog = author$project$Main$getCentroidOfBlocks(blocks);
		var blocksBoundingBox = author$project$Main$getBlocksBoundingBox(blocks);
		var blocksBoundingBoxSize = author$project$Main$getBoundingBoxSize(blocksBoundingBox);
		return A2(
			elm$core$String$join,
			'\n',
			A2(
				elm$core$List$cons,
				author$project$Main$listToCsvLine(
					_List_fromArray(
						['Target', 'Mass (T)', 'Volume (m³)', 'Length (m)', 'Width (m)', 'Height (m)', 'Center of gravity : x', 'Center of gravity : y', 'Center of gravity : z'])),
				A2(
					elm$core$List$cons,
					author$project$Main$listToCsvLine(
						A3(
							author$project$Main$flip,
							elm$core$Basics$append,
							_List_fromArray(
								[
									elm$core$String$fromFloat(blocksBoundingBoxSize.length),
									elm$core$String$fromFloat(blocksBoundingBoxSize.width),
									elm$core$String$fromFloat(blocksBoundingBoxSize.height),
									elm$core$String$fromFloat(cog.x),
									elm$core$String$fromFloat(cog.y),
									elm$core$String$fromFloat(cog.z)
								]),
							A2(author$project$Main$kpiSummaryToStringList, tags, totalSummary))),
					A2(
						elm$core$List$map,
						function (summary) {
							return author$project$Main$listToCsvLine(
								A3(
									author$project$Main$flip,
									elm$core$Basics$append,
									_List_fromArray(
										['', '', '', '', '', '']),
									A2(author$project$Main$kpiSummaryToStringList, tags, summary)));
						},
						summaryList))));
	});
var author$project$Main$viewSimpleKpi = F3(
	function (kpiTitle, className, totalValue) {
		return A2(
			elm$html$Html$div,
			_List_fromArray(
				[
					elm$html$Html$Attributes$class('kpi ' + className)
				]),
			_List_fromArray(
				[
					A2(
					elm$html$Html$div,
					_List_fromArray(
						[
							elm$html$Html$Attributes$class('kpi-total kpi-group')
						]),
					_List_fromArray(
						[
							A2(
							elm$html$Html$h5,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('kpi-label')
								]),
							_List_fromArray(
								[
									elm$html$Html$text(kpiTitle)
								])),
							A2(
							elm$html$Html$p,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('kpi-value')
								]),
							_List_fromArray(
								[
									elm$html$Html$text(
									elm$core$String$fromFloat(totalValue))
								]))
						]))
				]));
	});
var author$project$Main$viewCenterOfGravityXKpi = function (cogx) {
	return A3(
		author$project$Main$viewSimpleKpi,
		'Center of gravity : x',
		'cog-x',
		A2(author$project$StringValueInput$round_n, 1, cogx));
};
var author$project$Main$viewCenterOfGravityYKpi = function (cogy) {
	return A3(
		author$project$Main$viewSimpleKpi,
		'Center of gravity : y',
		'cog-y',
		A2(author$project$StringValueInput$round_n, 1, cogy));
};
var author$project$Main$viewCenterOfGravityZKpi = function (cogz) {
	return A3(
		author$project$Main$viewSimpleKpi,
		'Center of gravity : z',
		'cog-z',
		A2(author$project$StringValueInput$round_n, 1, cogz));
};
var author$project$Main$viewHeightKpi = function (height) {
	return A3(
		author$project$Main$viewSimpleKpi,
		'Height (m)',
		'height',
		A2(author$project$StringValueInput$round_n, 1, height));
};
var author$project$Main$viewLengthKpi = function (length) {
	return A3(
		author$project$Main$viewSimpleKpi,
		'Length (m)',
		'length',
		A2(author$project$StringValueInput$round_n, 1, length));
};
var author$project$Main$ToggleAccordion = F2(
	function (a, b) {
		return {$: 'ToggleAccordion', a: a, b: b};
	});
var elm$html$Html$h3 = _VirtualDom_node('h3');
var author$project$Main$viewKpi = F5(
	function (kpiTitle, className, totalValue, _n0, _n1) {
		return A2(
			elm$html$Html$div,
			_List_fromArray(
				[
					elm$html$Html$Attributes$class('kpi ' + className)
				]),
			_List_fromArray(
				[
					A2(
					elm$html$Html$div,
					_List_fromArray(
						[
							elm$html$Html$Attributes$class('kpi-total kpi-group'),
							elm$html$Html$Events$onClick(
							author$project$Main$NoJs(
								A2(author$project$Main$ToggleAccordion, true, className + '-kpi')))
						]),
					_List_fromArray(
						[
							A2(
							elm$html$Html$h3,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('kpi-label')
								]),
							_List_fromArray(
								[
									elm$html$Html$text(kpiTitle)
								])),
							A2(
							elm$html$Html$p,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('kpi-value')
								]),
							_List_fromArray(
								[
									elm$html$Html$text(
									elm$core$String$fromFloat(totalValue))
								])),
							lattyware$elm_fontawesome$FontAwesome$Solid$angleRight(_List_Nil)
						]))
				]));
	});
var author$project$Main$getColor = function (sirColor) {
	return author$project$SIRColorPicker$getColor(sirColor);
};
var author$project$Main$getColorName = function (sirColor) {
	return author$project$SIRColorPicker$getName(sirColor);
};
var author$project$Main$getTagLabelForColor = F2(
	function (sirColor, tags) {
		return elm$core$List$head(
			A2(
				elm$core$List$map,
				function ($) {
					return $.label;
				},
				A2(
					elm$core$List$filter,
					A2(
						elm$core$Basics$composeL,
						elm$core$Basics$eq(sirColor),
						function ($) {
							return $.color;
						}),
					tags)));
	});
var author$project$Main$getLabelForColor = F2(
	function (sirColor, tags) {
		return A2(
			elm$core$Maybe$withDefault,
			author$project$Main$getColorName(sirColor),
			A2(author$project$Main$getTagLabelForColor, sirColor, tags));
	});
var author$project$Main$CleanTags = {$: 'CleanTags'};
var author$project$Main$SetTagForColor = F2(
	function (a, b) {
		return {$: 'SetTagForColor', a: a, b: b};
	});
var author$project$Main$colorToCssRgbString = function (color) {
	var rgb = avh4$elm_color$Color$toRgba(color);
	return 'rgb(' + (elm$core$String$fromFloat(rgb.red) + (',' + (elm$core$String$fromFloat(rgb.green) + (',' + (elm$core$String$fromFloat(rgb.blue) + ')')))));
};
var author$project$Main$viewKpiByColor = F4(
	function (kpiClass, color, colorLabel, kpiValue) {
		return A2(
			elm$html$Html$div,
			_List_fromArray(
				[
					elm$html$Html$Attributes$class('input-group kpi-group ' + kpiClass)
				]),
			_List_fromArray(
				[
					A2(
					elm$html$Html$label,
					_List_fromArray(
						[
							elm$html$Html$Attributes$class('kpi-color-label'),
							A2(
							elm$html$Html$Attributes$style,
							'background-color',
							author$project$Main$colorToCssRgbString(color)),
							elm$html$Html$Attributes$title(colorLabel)
						]),
					_List_Nil),
					A2(
					elm$html$Html$input,
					_List_fromArray(
						[
							elm$html$Html$Attributes$type_('text'),
							elm$html$Html$Attributes$class('kpi-label'),
							elm$html$Html$Attributes$value(colorLabel),
							elm$html$Html$Events$onInput(
							A2(
								elm$core$Basics$composeL,
								author$project$Main$NoJs,
								author$project$Main$SetTagForColor(color))),
							elm$html$Html$Events$onBlur(
							author$project$Main$NoJs(author$project$Main$CleanTags))
						]),
					_List_Nil),
					A2(
					elm$html$Html$p,
					_List_fromArray(
						[
							elm$html$Html$Attributes$class('kpi-value')
						]),
					_List_fromArray(
						[
							elm$html$Html$text(
							elm$core$String$fromFloat(kpiValue))
						]))
				]));
	});
var author$project$Main$viewKpiWithColors = F5(
	function (kpiTitle, className, totalValue, valueForColor, tags) {
		return A2(
			elm$html$Html$div,
			_List_fromArray(
				[
					elm$html$Html$Attributes$class('kpi ' + className)
				]),
			A2(
				elm$core$List$cons,
				A2(
					elm$html$Html$div,
					_List_fromArray(
						[
							elm$html$Html$Attributes$class('kpi-total kpi-group'),
							elm$html$Html$Events$onClick(
							author$project$Main$NoJs(
								A2(author$project$Main$ToggleAccordion, false, className + '-kpi')))
						]),
					_List_fromArray(
						[
							A2(
							elm$html$Html$h3,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('kpi-label')
								]),
							_List_fromArray(
								[
									elm$html$Html$text(kpiTitle)
								])),
							A2(
							elm$html$Html$p,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('kpi-value')
								]),
							_List_fromArray(
								[
									elm$html$Html$text(
									elm$core$String$fromFloat(totalValue))
								])),
							lattyware$elm_fontawesome$FontAwesome$Solid$angleDown(_List_Nil)
						])),
				A2(
					elm$core$List$map,
					function (sirColor) {
						return A4(
							author$project$Main$viewKpiByColor,
							className,
							author$project$Main$getColor(sirColor),
							A2(author$project$Main$getLabelForColor, sirColor, tags),
							valueForColor(
								author$project$SIRColorPicker$getColor(sirColor)));
					},
					author$project$SIRColorPicker$palette)));
	});
var author$project$Main$viewMassKpi = F3(
	function (blocks, tags, showKpiForColors) {
		var viewMassKpiContent = showKpiForColors ? author$project$Main$viewKpiWithColors : author$project$Main$viewKpi;
		var transform = function (value) {
			return A2(author$project$StringValueInput$round_n, -1, value);
		};
		return A5(
			viewMassKpiContent,
			'Σ Mass (T)',
			'mass',
			transform(
				author$project$Main$getSumOfMasses(blocks)),
			A2(
				elm$core$Basics$composeL,
				transform,
				author$project$Main$getSumOfMassesForColor(blocks)),
			tags);
	});
var author$project$Main$viewVolumeKpi = F3(
	function (blocks, tags, showKpiForColors) {
		var viewVolumeKpiContent = showKpiForColors ? author$project$Main$viewKpiWithColors : author$project$Main$viewKpi;
		var transform = function (value) {
			return A2(author$project$StringValueInput$round_n, -1, value);
		};
		return A5(
			viewVolumeKpiContent,
			'Σ Volume (m³)',
			'volume',
			transform(
				author$project$Main$getSumOfVolumes(blocks)),
			A2(
				elm$core$Basics$composeL,
				transform,
				author$project$Main$getSumOfVolumesForColor(blocks)),
			tags);
	});
var author$project$Main$viewWidthKpi = function (width) {
	return A3(
		author$project$Main$viewSimpleKpi,
		'Width (m)',
		'width',
		A2(author$project$StringValueInput$round_n, 1, width));
};
var elm$html$Html$a = _VirtualDom_node('a');
var elm$html$Html$Attributes$download = function (fileName) {
	return A2(elm$html$Html$Attributes$stringProperty, 'download', fileName);
};
var elm$html$Html$Attributes$href = function (url) {
	return A2(
		elm$html$Html$Attributes$stringProperty,
		'href',
		_VirtualDom_noJavaScriptUri(url));
};
var elm$url$Url$percentEncode = _Url_percentEncode;
var lattyware$elm_fontawesome$FontAwesome$Solid$download = lattyware$elm_fontawesome$FontAwesome$Icon$view(
	A5(lattyware$elm_fontawesome$FontAwesome$Icon$Icon, 'fas', 'download', 'svg-inline--fa fa-download fa-w-16', '0 0 512 512', 'M216 0h80c13.3 0 24 10.7 24 24v168h87.7c17.8 0 26.7 21.5 14.1 34.1L269.7 378.3c-7.5 7.5-19.8 7.5-27.3 0L90.1 226.1c-12.6-12.6-3.7-34.1 14.1-34.1H192V24c0-13.3 10.7-24 24-24zm296 376v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h146.7l49 49c20.1 20.1 52.5 20.1 72.6 0l49-49H488c13.3 0 24 10.7 24 24zm-124 88c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm64 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z'));
var author$project$Main$viewKpiStudio = function (model) {
	var cog = author$project$Main$getCentroidOfBlocks(model.blocks);
	var blocksBoundingBox = author$project$Main$getBlocksBoundingBox(model.blocks);
	var blocksBoundingBoxSize = author$project$Main$getBoundingBoxSize(blocksBoundingBox);
	return A2(
		elm$html$Html$div,
		_List_fromArray(
			[
				elm$html$Html$Attributes$class('panel kpi-panel')
			]),
		_List_fromArray(
			[
				A2(
				elm$html$Html$h2,
				_List_fromArray(
					[
						elm$html$Html$Attributes$class('kpi-panel-title')
					]),
				_List_fromArray(
					[
						elm$html$Html$text('KPIs')
					])),
				A2(
				elm$html$Html$a,
				_List_fromArray(
					[
						elm$html$Html$Attributes$class('download-kpis'),
						elm$html$Html$Attributes$type_('button'),
						elm$html$Html$Attributes$href(
						'data:text/csv;charset=utf-8,' + elm$url$Url$percentEncode(
							A2(author$project$Main$kpisAsCsv, model.blocks, model.tags))),
						elm$html$Html$Attributes$download(
						author$project$Main$getDateForFilename(model) + ('_KPIs_Shipbuilder_' + (model.build + '.csv')))
					]),
				_List_fromArray(
					[
						lattyware$elm_fontawesome$FontAwesome$Solid$download(_List_Nil),
						elm$html$Html$text('Download as CSV')
					])),
				author$project$Main$viewLengthKpi(blocksBoundingBoxSize.length),
				author$project$Main$viewWidthKpi(blocksBoundingBoxSize.width),
				author$project$Main$viewHeightKpi(blocksBoundingBoxSize.height),
				author$project$Main$viewCenterOfGravityXKpi(cog.x),
				author$project$Main$viewCenterOfGravityYKpi(cog.y),
				author$project$Main$viewCenterOfGravityZKpi(cog.z),
				A3(
				author$project$Main$viewVolumeKpi,
				model.blocks,
				model.tags,
				A2(author$project$Main$isAccordionOpened, model.uiState, 'volume-kpi')),
				A3(
				author$project$Main$viewMassKpi,
				model.blocks,
				model.tags,
				A2(author$project$Main$isAccordionOpened, model.uiState, 'mass-kpi'))
			]));
};
var author$project$Main$SyncPartitions = {$: 'SyncPartitions'};
var author$project$Main$UpdatePartitionNumber = F2(
	function (a, b) {
		return {$: 'UpdatePartitionNumber', a: a, b: b};
	});
var author$project$Main$UpdatePartitionSpacing = F2(
	function (a, b) {
		return {$: 'UpdatePartitionSpacing', a: a, b: b};
	});
var author$project$Main$UpdatePartitionZeroPosition = F2(
	function (a, b) {
		return {$: 'UpdatePartitionZeroPosition', a: a, b: b};
	});
var author$project$Main$partitionTypeToString = function (partitionType) {
	if (partitionType.$ === 'Bulkhead') {
		return 'bulkhead';
	} else {
		return 'deck';
	}
};
var author$project$Main$SetSpacingException = F3(
	function (a, b, c) {
		return {$: 'SetSpacingException', a: a, b: b, c: c};
	});
var author$project$Main$viewPartitionSpacingListItem = F3(
	function (partitionType, defaultSpacing, partitionSpacingData) {
		return A2(
			elm$html$Html$li,
			_List_fromArray(
				[
					elm$html$Html$Attributes$class('spacing-item input-group')
				]),
			_List_fromArray(
				[
					A2(
					elm$html$Html$label,
					_List_Nil,
					_List_fromArray(
						[
							elm$html$Html$text(
							elm$core$String$fromInt(partitionSpacingData.number))
						])),
					A2(
					elm$html$Html$input,
					_List_fromArray(
						[
							elm$html$Html$Attributes$type_('text'),
							elm$html$Html$Attributes$placeholder(
							elm$core$String$fromFloat(defaultSpacing)),
							elm$html$Html$Attributes$value(
							function () {
								var _n0 = partitionSpacingData.maybeSpacing;
								if (_n0.$ === 'Just') {
									var spacing = _n0.a;
									return spacing.string;
								} else {
									return '';
								}
							}()),
							elm$html$Html$Events$onInput(
							A2(
								elm$core$Basics$composeL,
								author$project$Main$ToJs,
								A2(author$project$Main$SetSpacingException, partitionType, partitionSpacingData.index))),
							elm$html$Html$Events$onBlur(
							author$project$Main$NoJs(author$project$Main$SyncPartitions))
						]),
					_List_Nil)
				]));
	});
var author$project$Main$viewPartitionSpacingList = F2(
	function (partitionType, partitionSummary) {
		var getPartitionSpacingData = function (index) {
			return {
				index: index,
				maybeSpacing: A2(elm$core$Dict$get, index, partitionSummary.spacingExceptions),
				number: index - partitionSummary.zero.index
			};
		};
		var partitionList = elm$core$List$reverse(
			A2(
				elm$core$List$map,
				getPartitionSpacingData,
				A2(elm$core$List$range, 0, partitionSummary.number.value - 1)));
		return A2(
			elm$html$Html$ul,
			_List_fromArray(
				[
					elm$html$Html$Attributes$class('spacing-list')
				]),
			A2(
				elm$core$List$map,
				A2(author$project$Main$viewPartitionSpacingListItem, partitionType, partitionSummary.spacing.value),
				partitionList));
	});
var author$project$Main$viewPartitionSpacingDetails = F3(
	function (partitionType, isDetailsOpen, partitionSummary) {
		var rootClass = 'spacing-details';
		return A2(
			elm$html$Html$div,
			_List_fromArray(
				[
					elm$html$Html$Attributes$class(rootClass)
				]),
			isDetailsOpen ? _List_fromArray(
				[
					A2(
					elm$html$Html$p,
					_List_fromArray(
						[
							elm$html$Html$Attributes$class(rootClass + '-title'),
							elm$html$Html$Events$onClick(
							author$project$Main$NoJs(
								A2(
									author$project$Main$ToggleAccordion,
									false,
									author$project$Main$partitionTypeToString(partitionType) + '-spacing-details')))
						]),
					_List_fromArray(
						[
							elm$html$Html$text('Spacing details'),
							lattyware$elm_fontawesome$FontAwesome$Solid$angleDown(_List_Nil)
						])),
					(partitionSummary.number.value > 0) ? A2(author$project$Main$viewPartitionSpacingList, partitionType, partitionSummary) : A2(
					elm$html$Html$p,
					_List_fromArray(
						[
							elm$html$Html$Attributes$class('text-muted')
						]),
					_List_fromArray(
						[
							elm$html$Html$text(
							'There\'s no ' + (author$project$Main$partitionTypeToString(partitionType) + ' yet'))
						]))
				]) : _List_fromArray(
				[
					A2(
					elm$html$Html$p,
					_List_fromArray(
						[
							elm$html$Html$Attributes$class(rootClass + '-title'),
							elm$html$Html$Events$onClick(
							author$project$Main$NoJs(
								A2(
									author$project$Main$ToggleAccordion,
									true,
									author$project$Main$partitionTypeToString(partitionType) + '-spacing-details')))
						]),
					_List_fromArray(
						[
							elm$html$Html$text('Spacing details'),
							lattyware$elm_fontawesome$FontAwesome$Solid$angleRight(_List_Nil)
						]))
				]));
	});
var author$project$Main$viewBulkheads = F3(
	function (isDefiningOrigin, isDetailsOpen, bulkheads) {
		return A2(
			elm$html$Html$div,
			_List_fromArray(
				[
					elm$html$Html$Attributes$class('bulkheads stacked-subpanel')
				]),
			_List_fromArray(
				[
					A2(
					elm$html$Html$div,
					_List_fromArray(
						[
							elm$html$Html$Attributes$class('stacked-subpanel-header')
						]),
					_List_fromArray(
						[
							A2(
							elm$html$Html$h2,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('stacked-subpanel-title')
								]),
							_List_fromArray(
								[
									elm$html$Html$text('Bulkheads')
								]))
						])),
					A2(
					elm$html$Html$div,
					_List_fromArray(
						[
							elm$html$Html$Attributes$class('stacked-subpanel-content')
						]),
					_List_fromArray(
						[
							A2(
							elm$html$Html$div,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('input-group')
								]),
							_List_fromArray(
								[
									A2(
									elm$html$Html$label,
									_List_fromArray(
										[
											elm$html$Html$Attributes$for('bulkheads-number')
										]),
									_List_fromArray(
										[
											elm$html$Html$text('Number of bulkheads')
										])),
									A2(
									elm$html$Html$input,
									_List_fromArray(
										[
											elm$html$Html$Attributes$type_('number'),
											elm$html$Html$Attributes$id('bulkheads-number'),
											elm$html$Html$Attributes$value(bulkheads.number.string),
											elm$html$Html$Attributes$min('0'),
											elm$html$Html$Events$onInput(
											A2(
												elm$core$Basics$composeL,
												author$project$Main$ToJs,
												author$project$Main$UpdatePartitionNumber(author$project$Main$Bulkhead))),
											elm$html$Html$Events$onBlur(
											author$project$Main$NoJs(author$project$Main$SyncPartitions))
										]),
									_List_Nil)
								])),
							A2(
							elm$html$Html$div,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('input-group')
								]),
							_List_fromArray(
								[
									A2(
									elm$html$Html$label,
									_List_fromArray(
										[
											elm$html$Html$Attributes$for('bulkheads-spacing')
										]),
									_List_fromArray(
										[
											elm$html$Html$text('Default spacing of bulkheads')
										])),
									A2(
									elm$html$Html$input,
									_List_fromArray(
										[
											elm$html$Html$Attributes$type_('text'),
											elm$html$Html$Attributes$id('bulkheads-spacing'),
											elm$html$Html$Attributes$value(bulkheads.spacing.string),
											elm$html$Html$Events$onInput(
											A2(
												elm$core$Basics$composeL,
												author$project$Main$ToJs,
												author$project$Main$UpdatePartitionSpacing(author$project$Main$Bulkhead))),
											elm$html$Html$Events$onBlur(
											author$project$Main$NoJs(author$project$Main$SyncPartitions)),
											A3(
											author$project$ExtraEvents$onKeyDown,
											bulkheads.spacing.nbOfDigits,
											bulkheads.spacing.string,
											A2(
												elm$core$Basics$composeL,
												author$project$Main$ToJs,
												author$project$Main$UpdatePartitionSpacing(author$project$Main$Bulkhead)))
										]),
									_List_Nil)
								])),
							A2(
							elm$html$Html$div,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('bulkhead-zero')
								]),
							_List_fromArray(
								[
									isDefiningOrigin ? A2(
									elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											elm$html$Html$text('Defining bulkhead n°0...')
										])) : A2(
									elm$html$Html$button,
									_List_fromArray(
										[
											elm$html$Html$Attributes$disabled(!bulkheads.number.value),
											elm$html$Html$Events$onClick(
											A3(
												elm$core$Basics$composeL,
												author$project$Main$ToJs,
												author$project$Main$SwitchViewMode,
												author$project$Main$Partitioning(
													author$project$Main$OriginDefinition(author$project$Main$Bulkhead))))
										]),
									_List_fromArray(
										[
											elm$html$Html$text('Define bulkhead n°0')
										]))
								])),
							A2(
							elm$html$Html$div,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('input-group')
								]),
							_List_fromArray(
								[
									A2(
									elm$html$Html$label,
									_List_fromArray(
										[
											elm$html$Html$Attributes$for('bulkhead-zero-position')
										]),
									_List_fromArray(
										[
											elm$html$Html$text('Position of bulkhead n°0')
										])),
									A2(
									elm$html$Html$input,
									_List_fromArray(
										[
											elm$html$Html$Attributes$type_('text'),
											elm$html$Html$Attributes$id('bulkhead-zero-position'),
											elm$html$Html$Attributes$value(bulkheads.zero.position.string),
											elm$html$Html$Events$onInput(
											A2(
												elm$core$Basics$composeL,
												author$project$Main$ToJs,
												author$project$Main$UpdatePartitionZeroPosition(author$project$Main$Bulkhead))),
											elm$html$Html$Events$onBlur(
											author$project$Main$NoJs(author$project$Main$SyncPartitions)),
											A3(
											author$project$ExtraEvents$onKeyDown,
											bulkheads.zero.position.nbOfDigits,
											bulkheads.zero.position.string,
											A2(
												elm$core$Basics$composeL,
												author$project$Main$ToJs,
												author$project$Main$UpdatePartitionZeroPosition(author$project$Main$Bulkhead)))
										]),
									_List_Nil)
								])),
							A3(author$project$Main$viewPartitionSpacingDetails, author$project$Main$Bulkhead, isDetailsOpen, bulkheads)
						]))
				]));
	});
var author$project$Main$viewDecks = F3(
	function (isDefiningOrigin, isDetailsOpen, decks) {
		return A2(
			elm$html$Html$div,
			_List_fromArray(
				[
					elm$html$Html$Attributes$class('decks stacked-subpanel')
				]),
			_List_fromArray(
				[
					A2(
					elm$html$Html$div,
					_List_fromArray(
						[
							elm$html$Html$Attributes$class('stacked-subpanel-header')
						]),
					_List_fromArray(
						[
							A2(
							elm$html$Html$h2,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('stacked-subpanel-title')
								]),
							_List_fromArray(
								[
									elm$html$Html$text('Decks')
								]))
						])),
					A2(
					elm$html$Html$div,
					_List_fromArray(
						[
							elm$html$Html$Attributes$class('stacked-subpanel-content')
						]),
					_List_fromArray(
						[
							A2(
							elm$html$Html$div,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('input-group')
								]),
							_List_fromArray(
								[
									A2(
									elm$html$Html$label,
									_List_fromArray(
										[
											elm$html$Html$Attributes$for('decks-number')
										]),
									_List_fromArray(
										[
											elm$html$Html$text('Number of decks')
										])),
									A2(
									elm$html$Html$input,
									_List_fromArray(
										[
											elm$html$Html$Attributes$type_('number'),
											elm$html$Html$Attributes$id('decks-number'),
											elm$html$Html$Attributes$value(decks.number.string),
											elm$html$Html$Attributes$min('0'),
											elm$html$Html$Events$onInput(
											A2(
												elm$core$Basics$composeL,
												author$project$Main$ToJs,
												author$project$Main$UpdatePartitionNumber(author$project$Main$Deck))),
											elm$html$Html$Events$onBlur(
											author$project$Main$NoJs(author$project$Main$SyncPartitions))
										]),
									_List_Nil)
								])),
							A2(
							elm$html$Html$div,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('input-group')
								]),
							_List_fromArray(
								[
									A2(
									elm$html$Html$label,
									_List_fromArray(
										[
											elm$html$Html$Attributes$for('decks-spacing')
										]),
									_List_fromArray(
										[
											elm$html$Html$text('Default spacing of decks')
										])),
									A2(
									elm$html$Html$input,
									_List_fromArray(
										[
											elm$html$Html$Attributes$type_('text'),
											elm$html$Html$Attributes$id('decks-spacing'),
											elm$html$Html$Attributes$value(decks.spacing.string),
											elm$html$Html$Events$onInput(
											A2(
												elm$core$Basics$composeL,
												author$project$Main$ToJs,
												author$project$Main$UpdatePartitionSpacing(author$project$Main$Deck))),
											elm$html$Html$Events$onBlur(
											author$project$Main$NoJs(author$project$Main$SyncPartitions)),
											A3(
											author$project$ExtraEvents$onKeyDown,
											decks.spacing.nbOfDigits,
											decks.spacing.string,
											A2(
												elm$core$Basics$composeL,
												author$project$Main$ToJs,
												author$project$Main$UpdatePartitionSpacing(author$project$Main$Deck)))
										]),
									_List_Nil)
								])),
							A2(
							elm$html$Html$div,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('deck-zero')
								]),
							_List_fromArray(
								[
									isDefiningOrigin ? A2(
									elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											elm$html$Html$text('Defining deck n°0...')
										])) : A2(
									elm$html$Html$button,
									_List_fromArray(
										[
											elm$html$Html$Attributes$disabled(!decks.number.value),
											elm$html$Html$Events$onClick(
											A3(
												elm$core$Basics$composeL,
												author$project$Main$ToJs,
												author$project$Main$SwitchViewMode,
												author$project$Main$Partitioning(
													author$project$Main$OriginDefinition(author$project$Main$Deck))))
										]),
									_List_fromArray(
										[
											elm$html$Html$text('Define deck n°0')
										]))
								])),
							A2(
							elm$html$Html$div,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('input-group')
								]),
							_List_fromArray(
								[
									A2(
									elm$html$Html$label,
									_List_fromArray(
										[
											elm$html$Html$Attributes$for('deck-zero-position')
										]),
									_List_fromArray(
										[
											elm$html$Html$text('Position of deck n°0')
										])),
									A2(
									elm$html$Html$input,
									_List_fromArray(
										[
											elm$html$Html$Attributes$type_('text'),
											elm$html$Html$Attributes$id('deck-zero-position'),
											elm$html$Html$Attributes$value(decks.zero.position.string),
											elm$html$Html$Events$onInput(
											A2(
												elm$core$Basics$composeL,
												author$project$Main$ToJs,
												author$project$Main$UpdatePartitionZeroPosition(author$project$Main$Deck))),
											elm$html$Html$Events$onBlur(
											author$project$Main$NoJs(author$project$Main$SyncPartitions)),
											A3(
											author$project$ExtraEvents$onKeyDown,
											decks.zero.position.nbOfDigits,
											decks.zero.position.string,
											A2(
												elm$core$Basics$composeL,
												author$project$Main$ToJs,
												author$project$Main$UpdatePartitionZeroPosition(author$project$Main$Deck)))
										]),
									_List_Nil)
								])),
							A3(author$project$Main$viewPartitionSpacingDetails, author$project$Main$Deck, isDetailsOpen, decks)
						]))
				]));
	});
var author$project$Main$TogglePartitions = {$: 'TogglePartitions'};
var lattyware$elm_fontawesome$FontAwesome$Solid$eye = lattyware$elm_fontawesome$FontAwesome$Icon$view(
	A5(lattyware$elm_fontawesome$FontAwesome$Icon$Icon, 'fas', 'eye', 'svg-inline--fa fa-eye fa-w-18', '0 0 576 512', 'M569.354 231.631C512.969 135.949 407.81 72 288 72 168.14 72 63.004 135.994 6.646 231.631a47.999 47.999 0 0 0 0 48.739C63.031 376.051 168.19 440 288 440c119.86 0 224.996-63.994 281.354-159.631a47.997 47.997 0 0 0 0-48.738zM288 392c-75.162 0-136-60.827-136-136 0-75.162 60.826-136 136-136 75.162 0 136 60.826 136 136 0 75.162-60.826 136-136 136zm104-136c0 57.438-46.562 104-104 104s-104-46.562-104-104c0-17.708 4.431-34.379 12.236-48.973l-.001.032c0 23.651 19.173 42.823 42.824 42.823s42.824-19.173 42.824-42.823c0-23.651-19.173-42.824-42.824-42.824l-.032.001C253.621 156.431 270.292 152 288 152c57.438 0 104 46.562 104 104z'));
var lattyware$elm_fontawesome$FontAwesome$Solid$eyeSlash = lattyware$elm_fontawesome$FontAwesome$Icon$view(
	A5(lattyware$elm_fontawesome$FontAwesome$Icon$Icon, 'fas', 'eye-slash', 'svg-inline--fa fa-eye-slash fa-w-18', '0 0 576 512', 'M286.693 391.984l32.579 46.542A333.958 333.958 0 0 1 288 440C168.19 440 63.031 376.051 6.646 280.369a47.999 47.999 0 0 1 0-48.739c24.023-40.766 56.913-75.775 96.024-102.537l57.077 81.539C154.736 224.82 152 240.087 152 256c0 74.736 60.135 135.282 134.693 135.984zm282.661-111.615c-31.667 53.737-78.747 97.46-135.175 125.475l.011.015 41.47 59.2c7.6 10.86 4.96 25.82-5.9 33.42l-13.11 9.18c-10.86 7.6-25.82 4.96-33.42-5.9L100.34 46.94c-7.6-10.86-4.96-25.82 5.9-33.42l13.11-9.18c10.86-7.6 25.82-4.96 33.42 5.9l51.038 72.617C230.68 75.776 258.905 72 288 72c119.81 0 224.969 63.949 281.354 159.631a48.002 48.002 0 0 1 0 48.738zM424 256c0-75.174-60.838-136-136-136-17.939 0-35.056 3.473-50.729 9.772l19.299 27.058c25.869-8.171 55.044-6.163 80.4 7.41h-.03c-23.65 0-42.82 19.17-42.82 42.82 0 23.626 19.147 42.82 42.82 42.82 23.65 0 42.82-19.17 42.82-42.82v-.03c18.462 34.49 16.312 77.914-8.25 110.95v.01l19.314 27.061C411.496 321.2 424 290.074 424 256zM262.014 356.727l-77.53-110.757c-5.014 52.387 29.314 98.354 77.53 110.757z'));
var author$project$Main$viewShowingPartitions = function (showing) {
	return A2(
		elm$html$Html$div,
		_List_fromArray(
			[
				elm$html$Html$Attributes$class('showing-partitions input-group'),
				elm$html$Html$Events$onClick(
				author$project$Main$ToJs(author$project$Main$TogglePartitions))
			]),
		showing ? _List_fromArray(
			[
				elm$html$Html$text('Hide partitions'),
				lattyware$elm_fontawesome$FontAwesome$Solid$eyeSlash(_List_Nil)
			]) : _List_fromArray(
			[
				elm$html$Html$text('Show partitions'),
				lattyware$elm_fontawesome$FontAwesome$Solid$eye(_List_Nil)
			]));
};
var author$project$Main$viewPartitioning = F2(
	function (partitioningView, model) {
		var isDeckSpacingDetailsOpen = A2(author$project$Main$isAccordionOpened, model.uiState, 'deck-spacing-details');
		var isBulkheadSpacingDetailsOpen = A2(author$project$Main$isAccordionOpened, model.uiState, 'bulkhead-spacing-details');
		return A2(
			elm$html$Html$div,
			_List_fromArray(
				[
					elm$html$Html$Attributes$class('panel partitioning-panel')
				]),
			A2(
				elm$core$List$cons,
				author$project$Main$viewShowingPartitions(model.partitions.showing),
				function () {
					if (partitioningView.$ === 'PropertiesEdition') {
						return _List_fromArray(
							[
								A3(author$project$Main$viewDecks, false, isDeckSpacingDetailsOpen, model.partitions.decks),
								A3(author$project$Main$viewBulkheads, false, isBulkheadSpacingDetailsOpen, model.partitions.bulkheads)
							]);
					} else {
						if (partitioningView.a.$ === 'Deck') {
							var _n1 = partitioningView.a;
							return _List_fromArray(
								[
									A3(author$project$Main$viewDecks, true, isDeckSpacingDetailsOpen, model.partitions.decks),
									A3(author$project$Main$viewBulkheads, false, isBulkheadSpacingDetailsOpen, model.partitions.bulkheads)
								]);
						} else {
							var _n2 = partitioningView.a;
							return _List_fromArray(
								[
									A3(author$project$Main$viewDecks, false, isDeckSpacingDetailsOpen, model.partitions.decks),
									A3(author$project$Main$viewBulkheads, true, isBulkheadSpacingDetailsOpen, model.partitions.bulkheads)
								]);
						}
					}
				}()));
	});
var author$project$Main$WholeList = {$: 'WholeList'};
var author$project$Main$viewBackToWholeList = A2(
	elm$html$Html$div,
	_List_fromArray(
		[
			elm$html$Html$Attributes$class('focus-back'),
			elm$html$Html$Events$onClick(
			author$project$Main$ToJs(
				author$project$Main$SwitchViewMode(
					author$project$Main$SpaceReservation(author$project$Main$WholeList))))
		]),
	_List_fromArray(
		[
			lattyware$elm_fontawesome$FontAwesome$Solid$arrowLeft(_List_Nil)
		]));
var author$project$Main$AddCustomProperty = function (a) {
	return {$: 'AddCustomProperty', a: a};
};
var author$project$Main$viewBlockAddCustomProperty = A2(
	elm$html$Html$div,
	_List_fromArray(
		[
			elm$html$Html$Attributes$class('custom-property add-custom-property input-group')
		]),
	_List_fromArray(
		[
			A2(
			elm$html$Html$input,
			_List_fromArray(
				[
					elm$html$Html$Attributes$type_('text'),
					elm$html$Html$Attributes$placeholder('New custom property'),
					elm$html$Html$Events$onInput(
					A2(elm$core$Basics$composeL, author$project$Main$NoJs, author$project$Main$AddCustomProperty))
				]),
			_List_Nil)
		]));
var author$project$Main$DeleteCustomProperty = function (a) {
	return {$: 'DeleteCustomProperty', a: a};
};
var author$project$Main$SetValueForCustomProperty = F3(
	function (a, b, c) {
		return {$: 'SetValueForCustomProperty', a: a, b: b, c: c};
	});
var author$project$Main$UpdateCustomPropertyLabel = F2(
	function (a, b) {
		return {$: 'UpdateCustomPropertyLabel', a: a, b: b};
	});
var author$project$Main$viewBlockCustomProperty = F3(
	function (block, propertyIndex, property) {
		var propertyValue = A2(
			elm$core$Maybe$withDefault,
			'',
			A2(elm$core$Dict$get, block.uuid, property.values));
		var labelId = 'custom-property-' + elm$core$String$fromInt(propertyIndex + 1);
		return A2(
			elm$html$Html$div,
			_List_fromArray(
				[
					elm$html$Html$Attributes$class('custom-property input-group')
				]),
			_List_fromArray(
				[
					A2(
					elm$html$Html$div,
					_List_fromArray(
						[
							elm$html$Html$Attributes$class('custom-property-header')
						]),
					_List_fromArray(
						[
							A2(
							elm$html$Html$input,
							_List_fromArray(
								[
									elm$html$Html$Attributes$type_('text'),
									elm$html$Html$Attributes$class('custom-property-label label-like input-label'),
									elm$html$Html$Attributes$id(labelId),
									elm$html$Html$Attributes$value(property.label),
									elm$html$Html$Events$onInput(
									A2(
										elm$core$Basics$composeL,
										author$project$Main$NoJs,
										author$project$Main$UpdateCustomPropertyLabel(property)))
								]),
							_List_Nil),
							A2(
							elm$html$Html$p,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('delete-custom-property'),
									elm$html$Html$Attributes$title('Delete ' + property.label),
									elm$html$Html$Events$onClick(
									author$project$Main$NoJs(
										author$project$Main$DeleteCustomProperty(property)))
								]),
							_List_fromArray(
								[
									lattyware$elm_fontawesome$FontAwesome$Solid$trash(_List_Nil)
								]))
						])),
					A2(
					elm$html$Html$input,
					_List_fromArray(
						[
							elm$html$Html$Attributes$type_('text'),
							elm$html$Html$Attributes$class('custom-property-value'),
							elm$html$Html$Attributes$placeholder(property.label + ' value'),
							elm$html$Html$Events$onInput(
							A2(
								elm$core$Basics$composeL,
								author$project$Main$NoJs,
								A2(author$project$Main$SetValueForCustomProperty, property, block))),
							elm$html$Html$Attributes$value(propertyValue)
						]),
					_List_Nil)
				]));
	});
var author$project$Main$viewBlockCustomProperties = F2(
	function (customProperties, block) {
		return _Utils_ap(
			A2(
				elm$core$List$indexedMap,
				author$project$Main$viewBlockCustomProperty(block),
				customProperties),
			_List_fromArray(
				[author$project$Main$viewBlockAddCustomProperty]));
	});
var author$project$Main$ChangeBlockColor = F2(
	function (a, b) {
		return {$: 'ChangeBlockColor', a: a, b: b};
	});
var author$project$Main$Height = {$: 'Height'};
var author$project$Main$Length = {$: 'Length'};
var author$project$Main$ToggleBlocksVisibility = F2(
	function (a, b) {
		return {$: 'ToggleBlocksVisibility', a: a, b: b};
	});
var author$project$Main$Width = {$: 'Width'};
var author$project$Main$X = {$: 'X'};
var author$project$Main$Y = {$: 'Y'};
var author$project$Main$Z = {$: 'Z'};
var author$project$Main$LockCenterOfGravityToCenterOfVolume = function (a) {
	return {$: 'LockCenterOfGravityToCenterOfVolume', a: a};
};
var author$project$Main$SyncBlockInputs = function (a) {
	return {$: 'SyncBlockInputs', a: a};
};
var author$project$Main$UpdateCenterOfGravity = F3(
	function (a, b, c) {
		return {$: 'UpdateCenterOfGravity', a: a, b: b, c: c};
	});
var author$project$Main$axisToString = function (axis) {
	switch (axis.$) {
		case 'X':
			return 'x';
		case 'Y':
			return 'y';
		default:
			return 'z';
	}
};
var elm$html$Html$sub = _VirtualDom_node('sub');
var author$project$Main$viewCenterOfGravityUserInputCoordinate = F3(
	function (axis, block, coordinateInput) {
		var axisLabel = author$project$Main$axisToString(axis);
		return A2(
			elm$html$Html$div,
			_List_fromArray(
				[
					elm$html$Html$Attributes$class('input-group cog-coordinate')
				]),
			_List_fromArray(
				[
					A2(
					elm$html$Html$label,
					_List_fromArray(
						[
							elm$html$Html$Attributes$for('block-cog-' + (axisLabel + '-input')),
							elm$html$Html$Attributes$title('Center of gravity: ' + (axisLabel + ' coordinate'))
						]),
					_List_fromArray(
						[
							elm$html$Html$text('CoG'),
							A2(
							elm$html$Html$sub,
							_List_Nil,
							_List_fromArray(
								[
									elm$html$Html$text(axisLabel)
								]))
						])),
					A2(
					elm$html$Html$input,
					_List_fromArray(
						[
							elm$html$Html$Attributes$type_('text'),
							elm$html$Html$Attributes$id('block-cog-' + (axisLabel + '-input')),
							elm$html$Html$Attributes$value(coordinateInput.string),
							elm$html$Html$Events$onInput(
							A2(
								elm$core$Basics$composeL,
								author$project$Main$NoJs,
								A2(author$project$Main$UpdateCenterOfGravity, axis, block))),
							elm$html$Html$Events$onBlur(
							author$project$Main$NoJs(
								author$project$Main$SyncBlockInputs(block)))
						]),
					_List_Nil)
				]));
	});
var lattyware$elm_fontawesome$FontAwesome$Solid$crosshairs = lattyware$elm_fontawesome$FontAwesome$Icon$view(
	A5(lattyware$elm_fontawesome$FontAwesome$Icon$Icon, 'fas', 'crosshairs', 'svg-inline--fa fa-crosshairs fa-w-16', '0 0 512 512', 'M500 224h-30.364C455.724 130.325 381.675 56.276 288 42.364V12c0-6.627-5.373-12-12-12h-40c-6.627 0-12 5.373-12 12v30.364C130.325 56.276 56.276 130.325 42.364 224H12c-6.627 0-12 5.373-12 12v40c0 6.627 5.373 12 12 12h30.364C56.276 381.675 130.325 455.724 224 469.636V500c0 6.627 5.373 12 12 12h40c6.627 0 12-5.373 12-12v-30.364C381.675 455.724 455.724 381.675 469.636 288H500c6.627 0 12-5.373 12-12v-40c0-6.627-5.373-12-12-12zM288 404.634V364c0-6.627-5.373-12-12-12h-40c-6.627 0-12 5.373-12 12v40.634C165.826 392.232 119.783 346.243 107.366 288H148c6.627 0 12-5.373 12-12v-40c0-6.627-5.373-12-12-12h-40.634C119.768 165.826 165.757 119.783 224 107.366V148c0 6.627 5.373 12 12 12h40c6.627 0 12-5.373 12-12v-40.634C346.174 119.768 392.217 165.757 404.634 224H364c-6.627 0-12 5.373-12 12v40c0 6.627 5.373 12 12 12h40.634C392.232 346.174 346.243 392.217 288 404.634zM288 256c0 17.673-14.327 32-32 32s-32-14.327-32-32c0-17.673 14.327-32 32-32s32 14.327 32 32z'));
var author$project$Main$viewBlockCenterOfGravityUserInput = F2(
	function (block, cog) {
		return _List_fromArray(
			[
				A2(
				elm$html$Html$div,
				_List_fromArray(
					[
						elm$html$Html$Attributes$class('form-group-title')
					]),
				_List_fromArray(
					[
						elm$html$Html$text('Center of gravity'),
						A2(
						elm$html$Html$div,
						_List_fromArray(
							[
								elm$html$Html$Attributes$class('form-group-action'),
								elm$html$Html$Attributes$title('Reset the center of gravity to the center of the volume'),
								elm$html$Html$Events$onClick(
								author$project$Main$NoJs(
									author$project$Main$LockCenterOfGravityToCenterOfVolume(block)))
							]),
						_List_fromArray(
							[
								lattyware$elm_fontawesome$FontAwesome$Solid$crosshairs(_List_Nil)
							]))
					])),
				A3(author$project$Main$viewCenterOfGravityUserInputCoordinate, author$project$Main$X, block, cog.x),
				A3(author$project$Main$viewCenterOfGravityUserInputCoordinate, author$project$Main$Y, block, cog.y),
				A3(author$project$Main$viewCenterOfGravityUserInputCoordinate, author$project$Main$Z, block, cog.z)
			]);
	});
var author$project$Main$viewBlockCenterOfGravity = function (block) {
	return A2(
		elm$html$Html$div,
		_List_fromArray(
			[
				elm$html$Html$Attributes$class('block-cog form-group')
			]),
		A2(author$project$Main$viewBlockCenterOfGravityUserInput, block, block.centerOfGravity));
};
var author$project$Main$UpdateDensity = F2(
	function (a, b) {
		return {$: 'UpdateDensity', a: a, b: b};
	});
var author$project$Main$UpdateMass = F2(
	function (a, b) {
		return {$: 'UpdateMass', a: a, b: b};
	});
var author$project$Main$viewBlockMassInfo = function (block) {
	return A2(
		elm$html$Html$div,
		_List_fromArray(
			[
				elm$html$Html$Attributes$class('block-mass-info')
			]),
		_List_fromArray(
			[
				A2(
				elm$html$Html$div,
				_List_fromArray(
					[
						elm$html$Html$Attributes$class('block-volume')
					]),
				_List_fromArray(
					[
						A2(
						elm$html$Html$p,
						_List_fromArray(
							[
								elm$html$Html$Attributes$class('block-volume-label')
							]),
						_List_fromArray(
							[
								elm$html$Html$text('volume')
							])),
						A2(
						elm$html$Html$p,
						_List_fromArray(
							[
								elm$html$Html$Attributes$class('block-volume-value')
							]),
						_List_fromArray(
							[
								elm$html$Html$text(
								elm$core$String$fromFloat(
									A2(
										author$project$StringValueInput$round_n,
										0,
										author$project$Main$computeVolume(block))))
							]))
					])),
				A2(
				elm$html$Html$div,
				_List_fromArray(
					[
						elm$html$Html$Attributes$class('input-group block-density')
					]),
				_List_fromArray(
					[
						A2(
						elm$html$Html$label,
						_List_fromArray(
							[
								elm$html$Html$Attributes$for('block-density-input')
							]),
						_List_fromArray(
							[
								elm$html$Html$text('density')
							])),
						A2(
						elm$html$Html$input,
						_List_fromArray(
							[
								elm$html$Html$Attributes$type_('text'),
								elm$html$Html$Attributes$id('block-density-input'),
								elm$html$Html$Attributes$value(block.density.string),
								elm$html$Html$Events$onBlur(
								author$project$Main$NoJs(
									author$project$Main$SyncBlockInputs(block))),
								elm$html$Html$Events$onInput(
								A2(
									elm$core$Basics$composeL,
									author$project$Main$NoJs,
									author$project$Main$UpdateDensity(block)))
							]),
						_List_Nil)
					])),
				A2(
				elm$html$Html$div,
				_List_fromArray(
					[
						elm$html$Html$Attributes$class('input-group block-mass')
					]),
				_List_fromArray(
					[
						A2(
						elm$html$Html$label,
						_List_fromArray(
							[
								elm$html$Html$Attributes$for('block-mass-input')
							]),
						_List_fromArray(
							[
								elm$html$Html$text('mass')
							])),
						A2(
						elm$html$Html$input,
						_List_fromArray(
							[
								elm$html$Html$Attributes$type_('text'),
								elm$html$Html$Attributes$id('block-mass-input'),
								elm$html$Html$Attributes$value(block.mass.string),
								elm$html$Html$Events$onBlur(
								author$project$Main$NoJs(
									author$project$Main$SyncBlockInputs(block))),
								elm$html$Html$Events$onInput(
								A2(
									elm$core$Basics$composeL,
									author$project$Main$NoJs,
									author$project$Main$UpdateMass(block)))
							]),
						_List_Nil)
					]))
			]));
};
var author$project$Main$UpdatePosition = F3(
	function (a, b, c) {
		return {$: 'UpdatePosition', a: a, b: b, c: c};
	});
var author$project$Main$viewPositionInput = F2(
	function (axis, block) {
		var floatInput = A2(
			author$project$Main$axisAccessor,
			axis,
			function ($) {
				return $.position;
			}(block));
		return A2(
			author$project$StringValueInput$view,
			floatInput,
			A2(
				elm$core$Basics$composeL,
				author$project$Main$ToJs,
				A2(author$project$Main$UpdatePosition, axis, block)));
	});
var author$project$Main$UpdateDimension = F3(
	function (a, b, c) {
		return {$: 'UpdateDimension', a: a, b: b, c: c};
	});
var author$project$Main$viewSizeInputInput = F3(
	function (dimension, block, dimensionLabel) {
		var val = A2(
			author$project$Main$dimensionAccessor,
			dimension,
			function ($) {
				return $.size;
			}(block)).string;
		return A2(
			elm$html$Html$input,
			_List_fromArray(
				[
					elm$html$Html$Attributes$class('block-size-input'),
					elm$html$Html$Attributes$id('size-' + dimensionLabel),
					elm$html$Html$Attributes$type_('text'),
					elm$html$Html$Attributes$value(val),
					elm$html$Html$Events$onInput(
					A2(
						elm$core$Basics$composeL,
						author$project$Main$ToJs,
						A2(author$project$Main$UpdateDimension, dimension, block))),
					elm$html$Html$Events$onBlur(
					author$project$Main$NoJs(
						author$project$Main$SyncBlockInputs(block))),
					A3(
					author$project$ExtraEvents$onKeyDown,
					1,
					val,
					A2(
						elm$core$Basics$composeL,
						author$project$Main$ToJs,
						A2(author$project$Main$UpdateDimension, dimension, block)))
				]),
			_List_Nil);
	});
var author$project$Main$viewSizeInputLabel = function (dimensionLabel) {
	return A2(
		elm$html$Html$label,
		_List_fromArray(
			[
				elm$html$Html$Attributes$for('size-' + dimensionLabel)
			]),
		_List_fromArray(
			[
				elm$html$Html$text(dimensionLabel)
			]));
};
var author$project$Main$viewSizeInput = F2(
	function (dimension, block) {
		var dimensionLabel = function () {
			switch (dimension.$) {
				case 'Length':
					return 'length';
				case 'Width':
					return 'width';
				default:
					return 'height';
			}
		}();
		return A2(
			elm$html$Html$div,
			_List_fromArray(
				[
					elm$html$Html$Attributes$class('input-group')
				]),
			_List_fromArray(
				[
					author$project$Main$viewSizeInputLabel(dimensionLabel),
					A3(author$project$Main$viewSizeInputInput, dimension, block, dimensionLabel)
				]));
	});
var author$project$SIRColorPicker$toCssColor = function (color) {
	var rgb = avh4$elm_color$Color$toRgba(color);
	return 'rgba(' + (elm$core$String$fromFloat(rgb.red) + (',' + (elm$core$String$fromFloat(rgb.green) + (',' + (elm$core$String$fromFloat(rgb.blue) + (',' + (elm$core$String$fromFloat(rgb.alpha) + ')')))))));
};
var author$project$SIRColorPicker$viewColorItem = F3(
	function (msg, selectedColor, sirColor) {
		var cssColor = author$project$SIRColorPicker$toCssColor(
			author$project$SIRColorPicker$getColor(sirColor));
		return A2(
			elm$html$Html$div,
			_Utils_eq(
				selectedColor,
				author$project$SIRColorPicker$getColor(sirColor)) ? _List_fromArray(
				[
					elm$html$Html$Attributes$class('sir-color-item sir-color-item__selected'),
					A2(elm$html$Html$Attributes$style, 'background-color', cssColor),
					elm$html$Html$Attributes$title(
					author$project$SIRColorPicker$getName(sirColor))
				]) : _List_fromArray(
				[
					elm$html$Html$Attributes$class('sir-color-item'),
					A2(elm$html$Html$Attributes$style, 'background-color', cssColor),
					elm$html$Html$Events$onClick(
					msg(
						author$project$SIRColorPicker$getColor(sirColor))),
					elm$html$Html$Attributes$title(
					author$project$SIRColorPicker$getName(sirColor))
				]),
			_List_Nil);
	});
var author$project$SIRColorPicker$view = F2(
	function (selectedColor, msg) {
		return A2(
			elm$html$Html$div,
			_List_fromArray(
				[
					elm$html$Html$Attributes$class('sir-color-picker')
				]),
			A2(
				elm$core$List$map,
				A2(author$project$SIRColorPicker$viewColorItem, msg, selectedColor),
				author$project$SIRColorPicker$palette));
	});
var author$project$Main$viewBlockProperties = function (block) {
	return _List_fromArray(
		[
			block.visible ? A2(
			elm$html$Html$div,
			_List_fromArray(
				[
					elm$html$Html$Attributes$class('block-visibility primary-button'),
					elm$html$Html$Events$onClick(
					author$project$Main$ToJs(
						A2(
							author$project$Main$ToggleBlocksVisibility,
							_List_fromArray(
								[block]),
							false)))
				]),
			_List_fromArray(
				[
					elm$html$Html$text('Hide block'),
					lattyware$elm_fontawesome$FontAwesome$Solid$eyeSlash(_List_Nil)
				])) : A2(
			elm$html$Html$div,
			_List_fromArray(
				[
					elm$html$Html$Attributes$class('block-visibility primary-button'),
					elm$html$Html$Events$onClick(
					author$project$Main$ToJs(
						A2(
							author$project$Main$ToggleBlocksVisibility,
							_List_fromArray(
								[block]),
							true)))
				]),
			_List_fromArray(
				[
					elm$html$Html$text('Show block'),
					lattyware$elm_fontawesome$FontAwesome$Solid$eye(_List_Nil)
				])),
			A2(
			elm$html$Html$div,
			_List_fromArray(
				[
					elm$html$Html$Attributes$class('input-group block-color')
				]),
			_List_fromArray(
				[
					A2(
					elm$html$Html$label,
					_List_Nil,
					_List_fromArray(
						[
							elm$html$Html$text('Color')
						])),
					A2(
					author$project$SIRColorPicker$view,
					block.color,
					A2(
						elm$core$Basics$composeL,
						author$project$Main$ToJs,
						author$project$Main$ChangeBlockColor(block)))
				])),
			A2(
			elm$html$Html$div,
			_List_fromArray(
				[
					elm$html$Html$Attributes$class('block-position')
				]),
			A2(
				elm$core$List$map,
				A2(author$project$Main$flip, author$project$Main$viewPositionInput, block),
				_List_fromArray(
					[author$project$Main$X, author$project$Main$Y, author$project$Main$Z]))),
			A2(
			elm$html$Html$div,
			_List_fromArray(
				[
					elm$html$Html$Attributes$class('block-size')
				]),
			A2(
				elm$core$List$map,
				A2(author$project$Main$flip, author$project$Main$viewSizeInput, block),
				_List_fromArray(
					[author$project$Main$Length, author$project$Main$Width, author$project$Main$Height]))),
			author$project$Main$viewBlockCenterOfGravity(block),
			author$project$Main$viewBlockMassInfo(block)
		]);
};
var author$project$Main$RenameBlock = F2(
	function (a, b) {
		return {$: 'RenameBlock', a: a, b: b};
	});
var author$project$Main$viewEditableBlockName = function (block) {
	return A2(
		elm$html$Html$input,
		_List_fromArray(
			[
				elm$html$Html$Attributes$class('block-label'),
				elm$html$Html$Attributes$id(block.uuid),
				elm$html$Html$Attributes$value(block.label),
				elm$html$Html$Events$onInput(
				A2(
					elm$core$Basics$composeL,
					author$project$Main$NoJs,
					author$project$Main$RenameBlock(block)))
			]),
		_List_Nil);
};
var author$project$Main$viewDetailedBlock = F2(
	function (uuid, model) {
		return A2(
			elm$html$Html$div,
			_List_fromArray(
				[
					elm$html$Html$Attributes$class('panel blocks-panel blocks-panel__focus')
				]),
			function () {
				var _n0 = A2(author$project$Main$getBlockByUUID, uuid, model.blocks);
				if (_n0.$ === 'Just') {
					var block = _n0.a;
					return _List_fromArray(
						[
							A2(
							elm$html$Html$div,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('focus-title')
								]),
							_List_fromArray(
								[
									elm$html$Html$text('Properties of block:')
								])),
							A2(
							elm$html$Html$div,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('focus-header')
								]),
							_List_fromArray(
								[
									author$project$Main$viewBackToWholeList,
									A2(
									elm$html$Html$div,
									_List_fromArray(
										[
											elm$html$Html$Attributes$class('focus-label')
										]),
									_List_fromArray(
										[
											author$project$Main$viewEditableBlockName(block)
										]))
								])),
							A2(
							elm$html$Html$div,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('focus-sub-header')
								]),
							_List_fromArray(
								[
									A2(
									elm$html$Html$div,
									_List_fromArray(
										[
											elm$html$Html$Attributes$class('focus-uuid')
										]),
									_List_fromArray(
										[
											elm$html$Html$text(block.uuid)
										]))
								])),
							A2(
							elm$html$Html$div,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('focus-properties')
								]),
							author$project$Main$viewBlockProperties(block)),
							A2(
							elm$html$Html$div,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('focus-custom-properties')
								]),
							A2(author$project$Main$viewBlockCustomProperties, model.customProperties, block))
						]);
				} else {
					return _List_Nil;
				}
			}());
	});
var author$project$Main$blockToCsvLine = F3(
	function (tags, customProperties, block) {
		var getTagLabelForColor_ = function (sirColor) {
			return elm$core$List$head(
				A2(
					elm$core$List$map,
					function ($) {
						return $.label;
					},
					A2(
						elm$core$List$filter,
						A2(
							elm$core$Basics$composeL,
							elm$core$Basics$eq(sirColor),
							function ($) {
								return $.color;
							}),
						tags)));
		};
		var getColorName_ = function (sirColor) {
			return author$project$SIRColorPicker$getName(sirColor);
		};
		var getLabelForColor_ = function (sirColor) {
			return A2(
				elm$core$Maybe$withDefault,
				getColorName_(sirColor),
				getTagLabelForColor_(sirColor));
		};
		var customPropertyValues = A2(
			elm$core$List$map,
			function (customProperty) {
				return A2(
					elm$core$Maybe$withDefault,
					'',
					A2(elm$core$Dict$get, block.uuid, customProperty.values));
			},
			customProperties);
		var cog = author$project$Main$getCenterOfGravity(block);
		return author$project$Main$listToCsvLine(
			_Utils_ap(
				_List_fromArray(
					[
						block.uuid,
						block.label,
						A2(
						elm$core$Maybe$withDefault,
						'',
						A2(
							elm$core$Maybe$map,
							getLabelForColor_,
							author$project$SIRColorPicker$fromColor(block.color))),
						block.position.x.string,
						block.position.y.string,
						block.position.z.string,
						block.size.length.string,
						block.size.height.string,
						block.size.width.string,
						elm$core$String$fromFloat(cog.x),
						elm$core$String$fromFloat(cog.y),
						elm$core$String$fromFloat(cog.z),
						elm$core$String$fromFloat(
						author$project$Main$computeVolume(block)),
						block.mass.string,
						block.density.string
					]),
				customPropertyValues));
	});
var author$project$Main$blocksAsCsv = F3(
	function (blocksList, tags, customProperties) {
		var customPropertyLabels = A2(
			elm$core$List$map,
			function ($) {
				return $.label;
			},
			customProperties);
		return A2(
			elm$core$String$join,
			'\n',
			A2(
				elm$core$List$cons,
				author$project$Main$listToCsvLine(
					_Utils_ap(
						_List_fromArray(
							['uuid', 'label', 'color', 'x', 'y', 'z', 'length', 'height', 'width', 'Center of gravity: x', 'Center of gravity: y', 'Center of gravity: z', 'volume', 'mass', 'density']),
						customPropertyLabels)),
				A2(
					elm$core$List$map,
					A2(author$project$Main$blockToCsvLine, tags, customProperties),
					blocksList)));
	});
var author$project$Main$viewCsvButton = A2(
	elm$html$Html$div,
	_List_fromArray(
		[
			elm$html$Html$Attributes$class('csv-button text-button')
		]),
	_List_fromArray(
		[
			elm$html$Html$text('CSV')
		]));
var author$project$Main$downloadBlocksAsCsv = F2(
	function (blocksList, model) {
		return A2(
			elm$html$Html$a,
			_List_fromArray(
				[
					elm$html$Html$Attributes$type_('button'),
					elm$html$Html$Attributes$href(
					'data:text/csv;charset=utf-8,' + elm$url$Url$percentEncode(
						A3(author$project$Main$blocksAsCsv, blocksList, model.tags, model.customProperties))),
					elm$html$Html$Attributes$download(
					author$project$Main$getDateForFilename(model) + ('_Blocks_Shipbuilder_' + (model.build + '.csv'))),
					elm$html$Html$Attributes$title('Download blocks as CSV')
				]),
			_List_fromArray(
				[author$project$Main$viewCsvButton]));
	});
var author$project$Main$UnsetBlockContextualMenu = {$: 'UnsetBlockContextualMenu'};
var author$project$Main$MoveBlockDown = function (a) {
	return {$: 'MoveBlockDown', a: a};
};
var author$project$Main$MoveBlockUp = function (a) {
	return {$: 'MoveBlockUp', a: a};
};
var author$project$Main$SelectBlock = function (a) {
	return {$: 'SelectBlock', a: a};
};
var elm$virtual_dom$VirtualDom$Custom = function (a) {
	return {$: 'Custom', a: a};
};
var elm$html$Html$Events$custom = F2(
	function (event, decoder) {
		return A2(
			elm$virtual_dom$VirtualDom$on,
			event,
			elm$virtual_dom$VirtualDom$Custom(decoder));
	});
var author$project$Main$onClickWithoutPropagation = function (msg) {
	return A2(
		elm$html$Html$Events$custom,
		'click',
		A2(
			elm$json$Json$Decode$map,
			function (_n0) {
				return {message: msg, preventDefault: false, stopPropagation: true};
			},
			elm$json$Json$Decode$succeed(msg)));
};
var author$project$Main$RemoveBlock = function (a) {
	return {$: 'RemoveBlock', a: a};
};
var author$project$Main$viewDeleteBlockAction = function (block) {
	return A2(
		elm$html$Html$div,
		_List_fromArray(
			[
				elm$html$Html$Attributes$class('block-action delete-block'),
				author$project$Main$onClickWithoutPropagation(
				author$project$Main$ToJs(
					author$project$Main$RemoveBlock(block))),
				elm$html$Html$Attributes$title('Delete block')
			]),
		_List_fromArray(
			[
				lattyware$elm_fontawesome$FontAwesome$Solid$trash(_List_Nil)
			]));
};
var author$project$Main$viewHideBlockAction = function (block) {
	return A2(
		elm$html$Html$div,
		_List_fromArray(
			[
				elm$html$Html$Attributes$class('block-action hide-block'),
				author$project$Main$onClickWithoutPropagation(
				author$project$Main$ToJs(
					A2(
						author$project$Main$ToggleBlocksVisibility,
						_List_fromArray(
							[block]),
						false))),
				elm$html$Html$Attributes$title('Hide block')
			]),
		_List_fromArray(
			[
				lattyware$elm_fontawesome$FontAwesome$Solid$eyeSlash(_List_Nil)
			]));
};
var author$project$Main$viewShowBlockAction = function (block) {
	return A2(
		elm$html$Html$div,
		_List_fromArray(
			[
				elm$html$Html$Attributes$class('block-action show-block'),
				author$project$Main$onClickWithoutPropagation(
				author$project$Main$ToJs(
					A2(
						author$project$Main$ToggleBlocksVisibility,
						_List_fromArray(
							[block]),
						true))),
				elm$html$Html$Attributes$title('Show block')
			]),
		_List_fromArray(
			[
				lattyware$elm_fontawesome$FontAwesome$Solid$eye(_List_Nil)
			]));
};
var author$project$Main$viewBlockContextualMenu = function (block) {
	return A2(
		elm$html$Html$div,
		_List_fromArray(
			[
				elm$html$Html$Attributes$class('block-contextual-menu'),
				author$project$Main$onClickWithoutPropagation(
				author$project$Main$NoJs(author$project$Main$NoOp))
			]),
		_List_fromArray(
			[
				author$project$Main$viewDeleteBlockAction(block),
				block.visible ? author$project$Main$viewHideBlockAction(block) : author$project$Main$viewShowBlockAction(block)
			]));
};
var lattyware$elm_fontawesome$FontAwesome$Regular$timesCircle = lattyware$elm_fontawesome$FontAwesome$Icon$view(
	A5(lattyware$elm_fontawesome$FontAwesome$Icon$Icon, 'far', 'times-circle', 'svg-inline--fa fa-times-circle fa-w-16', '0 0 512 512', 'M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200zm101.8-262.2L295.6 256l62.2 62.2c4.7 4.7 4.7 12.3 0 17l-22.6 22.6c-4.7 4.7-12.3 4.7-17 0L256 295.6l-62.2 62.2c-4.7 4.7-12.3 4.7-17 0l-22.6-22.6c-4.7-4.7-4.7-12.3 0-17l62.2-62.2-62.2-62.2c-4.7-4.7-4.7-12.3 0-17l22.6-22.6c4.7-4.7 12.3-4.7 17 0l62.2 62.2 62.2-62.2c4.7-4.7 12.3-4.7 17 0l22.6 22.6c4.7 4.7 4.7 12.3 0 17z'));
var author$project$Main$viewCloseBlockContextualMenuAction = A2(
	elm$html$Html$div,
	_List_fromArray(
		[
			elm$html$Html$Attributes$class('block-action close-contextual-menu'),
			elm$html$Html$Events$onClick(
			author$project$Main$NoJs(author$project$Main$UnsetBlockContextualMenu)),
			elm$html$Html$Attributes$title('Hide extra actions')
		]),
	_List_fromArray(
		[
			lattyware$elm_fontawesome$FontAwesome$Regular$timesCircle(_List_Nil)
		]));
var author$project$Main$viewFocusBlockAction = function (block) {
	return A2(
		elm$html$Html$div,
		_List_fromArray(
			[
				elm$html$Html$Attributes$class('block-action focus-block'),
				elm$html$Html$Events$onClick(
				author$project$Main$ToJs(
					author$project$Main$SwitchViewMode(
						author$project$Main$SpaceReservation(
							author$project$Main$DetailedBlock(block.uuid))))),
				elm$html$Html$Attributes$title('Focus block')
			]),
		_List_fromArray(
			[
				lattyware$elm_fontawesome$FontAwesome$Solid$arrowRight(_List_Nil)
			]));
};
var author$project$Main$SetBlockContextualMenu = function (a) {
	return {$: 'SetBlockContextualMenu', a: a};
};
var lattyware$elm_fontawesome$FontAwesome$Solid$ellipsisH = lattyware$elm_fontawesome$FontAwesome$Icon$view(
	A5(lattyware$elm_fontawesome$FontAwesome$Icon$Icon, 'fas', 'ellipsis-h', 'svg-inline--fa fa-ellipsis-h fa-w-16', '0 0 512 512', 'M328 256c0 39.8-32.2 72-72 72s-72-32.2-72-72 32.2-72 72-72 72 32.2 72 72zm104-72c-39.8 0-72 32.2-72 72s32.2 72 72 72 72-32.2 72-72-32.2-72-72-72zm-352 0c-39.8 0-72 32.2-72 72s32.2 72 72 72 72-32.2 72-72-32.2-72-72-72z'));
var author$project$Main$viewOpenBlockContextualMenuAction = function (block) {
	return A2(
		elm$html$Html$div,
		_List_fromArray(
			[
				elm$html$Html$Attributes$class('block-action open-contextual-menu'),
				elm$html$Html$Events$onClick(
				author$project$Main$NoJs(
					author$project$Main$SetBlockContextualMenu(block.uuid))),
				elm$html$Html$Attributes$title('See extra actions')
			]),
		_List_fromArray(
			[
				lattyware$elm_fontawesome$FontAwesome$Solid$ellipsisH(_List_Nil)
			]));
};
var lattyware$elm_fontawesome$FontAwesome$Solid$angleUp = lattyware$elm_fontawesome$FontAwesome$Icon$view(
	A5(lattyware$elm_fontawesome$FontAwesome$Icon$Icon, 'fas', 'angle-up', 'svg-inline--fa fa-angle-up fa-w-10', '0 0 320 512', 'M177 159.7l136 136c9.4 9.4 9.4 24.6 0 33.9l-22.6 22.6c-9.4 9.4-24.6 9.4-33.9 0L160 255.9l-96.4 96.4c-9.4 9.4-24.6 9.4-33.9 0L7 329.7c-9.4-9.4-9.4-24.6 0-33.9l136-136c9.4-9.5 24.6-9.5 34-.1z'));
var author$project$Main$viewBlockItemContent = F2(
	function (showContextualMenu, block) {
		return showContextualMenu ? _List_fromArray(
			[
				A2(
				elm$html$Html$div,
				_List_fromArray(
					[
						elm$html$Html$Attributes$class('block-info-wrapper'),
						elm$html$Html$Events$onClick(
						author$project$Main$ToJs(
							author$project$Main$SelectBlock(block)))
					]),
				_List_fromArray(
					[
						author$project$Main$viewEditableBlockName(block),
						A2(
						elm$html$Html$p,
						_List_fromArray(
							[
								elm$html$Html$Attributes$class('block-uuid')
							]),
						_List_fromArray(
							[
								elm$html$Html$text(block.uuid)
							])),
						author$project$Main$viewBlockContextualMenu(block)
					])),
				A2(
				elm$html$Html$div,
				_List_fromArray(
					[
						elm$html$Html$Attributes$class('block-actions')
					]),
				_List_fromArray(
					[
						author$project$Main$viewFocusBlockAction(block),
						author$project$Main$viewCloseBlockContextualMenuAction
					]))
			]) : _List_fromArray(
			[
				A2(
				elm$html$Html$div,
				_List_fromArray(
					[
						elm$html$Html$Attributes$class('block-info-wrapper'),
						elm$html$Html$Events$onClick(
						author$project$Main$ToJs(
							author$project$Main$SelectBlock(block)))
					]),
				_List_fromArray(
					[
						author$project$Main$viewEditableBlockName(block),
						A2(
						elm$html$Html$p,
						_List_fromArray(
							[
								elm$html$Html$Attributes$class('block-uuid')
							]),
						_List_fromArray(
							[
								elm$html$Html$text(block.uuid)
							])),
						A2(
						elm$html$Html$div,
						_List_fromArray(
							[
								elm$html$Html$Attributes$class('move-up move-block'),
								author$project$Main$onClickWithoutPropagation(
								author$project$Main$NoJs(
									author$project$Main$MoveBlockUp(block))),
								elm$html$Html$Attributes$title('Move up')
							]),
						_List_fromArray(
							[
								lattyware$elm_fontawesome$FontAwesome$Solid$angleUp(_List_Nil)
							])),
						A2(
						elm$html$Html$div,
						_List_fromArray(
							[
								elm$html$Html$Attributes$class('move-down move-block'),
								author$project$Main$onClickWithoutPropagation(
								author$project$Main$NoJs(
									author$project$Main$MoveBlockDown(block))),
								elm$html$Html$Attributes$title('Move down')
							]),
						_List_fromArray(
							[
								lattyware$elm_fontawesome$FontAwesome$Solid$angleDown(_List_Nil)
							]))
					])),
				A2(
				elm$html$Html$div,
				_List_fromArray(
					[
						elm$html$Html$Attributes$class('block-actions')
					]),
				_List_fromArray(
					[
						author$project$Main$viewFocusBlockAction(block),
						author$project$Main$viewOpenBlockContextualMenuAction(block)
					]))
			]);
	});
var elm$html$Html$Events$onMouseLeave = function (msg) {
	return A2(
		elm$html$Html$Events$on,
		'mouseleave',
		elm$json$Json$Decode$succeed(msg));
};
var author$project$Main$viewBlockItem = F2(
	function (showContextualMenu, block) {
		return A2(
			elm$html$Html$li,
			_List_fromArray(
				[
					block.visible ? elm$html$Html$Attributes$class('block-item') : elm$html$Html$Attributes$class('block-item hidden'),
					A2(
					elm$html$Html$Attributes$style,
					'borderColor',
					author$project$Main$colorToCssRgbString(block.color)),
					elm$html$Html$Events$onMouseLeave(
					author$project$Main$NoJs(author$project$Main$UnsetBlockContextualMenu))
				]),
			A2(author$project$Main$viewBlockItemContent, showContextualMenu, block));
	});
var author$project$Main$viewBlockItemWithSelection = F3(
	function (showContextualMenu, selectedBlocks, block) {
		return A2(elm$core$List$member, block.uuid, selectedBlocks) ? A2(
			elm$html$Html$li,
			_List_fromArray(
				[
					block.visible ? elm$html$Html$Attributes$class('block-item block-item__selected') : elm$html$Html$Attributes$class('block-item block-item__selected hidden'),
					A2(
					elm$html$Html$Attributes$style,
					'borderColor',
					author$project$Main$colorToCssRgbString(block.color))
				]),
			A2(author$project$Main$viewBlockItemContent, showContextualMenu, block)) : A2(author$project$Main$viewBlockItem, showContextualMenu, block);
	});
var author$project$Main$AddBlock = function (a) {
	return {$: 'AddBlock', a: a};
};
var author$project$Main$viewNewBlockItem = A2(
	elm$html$Html$li,
	_List_fromArray(
		[
			elm$html$Html$Attributes$class('add-block')
		]),
	_List_fromArray(
		[
			A2(
			elm$html$Html$input,
			_List_fromArray(
				[
					elm$html$Html$Attributes$class('block-label'),
					elm$html$Html$Attributes$type_('text'),
					elm$html$Html$Attributes$placeholder('New block'),
					elm$html$Html$Attributes$value(''),
					elm$html$Html$Events$onInput(
					A2(elm$core$Basics$composeL, author$project$Main$ToJs, author$project$Main$AddBlock))
				]),
			_List_Nil)
		]));
var author$project$Main$viewBlockList = function (model) {
	var showContextualMenuFor = function (block) {
		return A2(
			elm$core$Maybe$withDefault,
			false,
			A2(
				elm$core$Maybe$map,
				elm$core$Basics$eq(block.uuid),
				model.uiState.blockContextualMenu));
	};
	var viewBlockWithSelection = function (block) {
		return A3(
			author$project$Main$viewBlockItemWithSelection,
			showContextualMenuFor(block),
			model.selectedBlocks,
			block);
	};
	var viewBlockWithoutSelection = function (block) {
		return A2(
			author$project$Main$viewBlockItem,
			showContextualMenuFor(block),
			block);
	};
	return A2(
		elm$html$Html$ul,
		_List_fromArray(
			[
				elm$html$Html$Attributes$class('blocks')
			]),
		(elm$core$List$length(model.selectedBlocks) > 0) ? _Utils_ap(
			A2(
				elm$core$List$map,
				viewBlockWithSelection,
				author$project$Main$toList(model.blocks)),
			_List_fromArray(
				[author$project$Main$viewNewBlockItem])) : _Utils_ap(
			A2(
				elm$core$List$map,
				viewBlockWithoutSelection,
				author$project$Main$toList(model.blocks)),
			_List_fromArray(
				[author$project$Main$viewNewBlockItem])));
};
var author$project$Main$RemoveBlocks = function (a) {
	return {$: 'RemoveBlocks', a: a};
};
var author$project$Main$viewDeleteBlocksAction = function (blocks) {
	return A2(
		elm$html$Html$div,
		_List_fromArray(
			[
				elm$html$Html$Attributes$class('blocks-action delete-block'),
				elm$html$Html$Events$onClick(
				author$project$Main$ToJs(
					author$project$Main$RemoveBlocks(blocks))),
				elm$html$Html$Attributes$title('Delete all blocks')
			]),
		_List_fromArray(
			[
				lattyware$elm_fontawesome$FontAwesome$Solid$trash(_List_Nil)
			]));
};
var author$project$Main$viewHideBlocksAction = function (blocks) {
	return A2(
		elm$html$Html$div,
		_List_fromArray(
			[
				elm$html$Html$Attributes$class('blocks-action hide-all-blocks'),
				elm$html$Html$Events$onClick(
				author$project$Main$ToJs(
					A2(author$project$Main$ToggleBlocksVisibility, blocks, false))),
				elm$html$Html$Attributes$title('Hide all blocks')
			]),
		_List_fromArray(
			[
				lattyware$elm_fontawesome$FontAwesome$Solid$eyeSlash(_List_Nil)
			]));
};
var author$project$Main$viewShowBlocksAction = function (blocks) {
	return A2(
		elm$html$Html$div,
		_List_fromArray(
			[
				elm$html$Html$Attributes$class('blocks-action show-all-blocks'),
				elm$html$Html$Events$onClick(
				author$project$Main$ToJs(
					A2(author$project$Main$ToggleBlocksVisibility, blocks, true))),
				elm$html$Html$Attributes$title('Show all blocks')
			]),
		_List_fromArray(
			[
				lattyware$elm_fontawesome$FontAwesome$Solid$eye(_List_Nil)
			]));
};
var author$project$Main$viewSelectedBlocksSummary = function (model) {
	var selectedBlocks = A2(
		elm$core$List$filter,
		function (block) {
			return A2(elm$core$List$member, block.uuid, model.selectedBlocks);
		},
		author$project$Main$toList(model.blocks));
	return A2(
		elm$html$Html$div,
		_List_fromArray(
			[
				(elm$core$List$length(selectedBlocks) > 1) ? elm$html$Html$Attributes$class('selected-blocks-summary selected-blocks-summary__visible') : elm$html$Html$Attributes$class('selected-blocks-summary')
			]),
		_List_fromArray(
			[
				elm$html$Html$text(
				elm$core$String$fromInt(
					elm$core$List$length(selectedBlocks)) + ' selected blocks'),
				A2(
				elm$html$Html$div,
				_List_fromArray(
					[
						elm$html$Html$Attributes$class('blocks-actions')
					]),
				_List_fromArray(
					[
						A2(author$project$Main$downloadBlocksAsCsv, selectedBlocks, model),
						A2(
						elm$html$Html$div,
						_List_fromArray(
							[
								elm$html$Html$Attributes$class('blocks-visibility')
							]),
						_List_fromArray(
							[
								author$project$Main$viewShowBlocksAction(selectedBlocks),
								author$project$Main$viewHideBlocksAction(selectedBlocks),
								author$project$Main$viewDeleteBlocksAction(selectedBlocks)
							]))
					]))
			]));
};
var author$project$Main$viewWholeList = function (model) {
	return A2(
		elm$html$Html$div,
		_List_fromArray(
			[
				elm$html$Html$Attributes$class('panel blocks-panel')
			]),
		_List_fromArray(
			[
				A2(
				elm$html$Html$h2,
				_List_Nil,
				_List_fromArray(
					[
						elm$html$Html$text('Blocks'),
						A2(
						elm$html$Html$div,
						_List_fromArray(
							[
								elm$html$Html$Attributes$class('blocks-actions')
							]),
						_List_fromArray(
							[
								A2(
								author$project$Main$downloadBlocksAsCsv,
								author$project$Main$toList(model.blocks),
								model),
								A2(
								elm$html$Html$div,
								_List_fromArray(
									[
										elm$html$Html$Attributes$class('blocks-visibility')
									]),
								_List_fromArray(
									[
										author$project$Main$viewShowBlocksAction(
										author$project$Main$toList(model.blocks)),
										author$project$Main$viewHideBlocksAction(
										author$project$Main$toList(model.blocks))
									])),
								author$project$Main$viewDeleteBlocksAction(
								author$project$Main$toList(model.blocks))
							])),
						author$project$Main$viewSelectedBlocksSummary(model)
					])),
				author$project$Main$viewBlockList(model)
			]));
};
var author$project$Main$viewSpaceReservationPanel = F2(
	function (spaceReservationView, model) {
		if (spaceReservationView.$ === 'DetailedBlock') {
			var uuid = spaceReservationView.a;
			return A2(author$project$Main$viewDetailedBlock, uuid, model);
		} else {
			return author$project$Main$viewWholeList(model);
		}
	});
var author$project$Main$viewPanel = function (model) {
	var _n0 = model.viewMode;
	switch (_n0.$) {
		case 'SpaceReservation':
			var spaceReservationView = _n0.a;
			return A2(author$project$Main$viewSpaceReservationPanel, spaceReservationView, model);
		case 'Hull':
			var hullView = _n0.a;
			return A2(author$project$Main$viewHullPanel, hullView, model);
		case 'Partitioning':
			var partitioningView = _n0.a;
			return A2(author$project$Main$viewPartitioning, partitioningView, model);
		default:
			return author$project$Main$viewKpiStudio(model);
	}
};
var author$project$Main$viewBuild = function (model) {
	return A2(
		elm$html$Html$p,
		_List_fromArray(
			[
				elm$html$Html$Attributes$class('build-info')
			]),
		_List_fromArray(
			[
				elm$html$Html$text(model.build)
			]));
};
var author$project$Main$KpiStudio = {$: 'KpiStudio'};
var lattyware$elm_fontawesome$FontAwesome$Regular$clone = lattyware$elm_fontawesome$FontAwesome$Icon$view(
	A5(lattyware$elm_fontawesome$FontAwesome$Icon$Icon, 'far', 'clone', 'svg-inline--fa fa-clone fa-w-16', '0 0 512 512', 'M464 0H144c-26.51 0-48 21.49-48 48v48H48c-26.51 0-48 21.49-48 48v320c0 26.51 21.49 48 48 48h320c26.51 0 48-21.49 48-48v-48h48c26.51 0 48-21.49 48-48V48c0-26.51-21.49-48-48-48zM362 464H54a6 6 0 0 1-6-6V150a6 6 0 0 1 6-6h42v224c0 26.51 21.49 48 48 48h224v42a6 6 0 0 1-6 6zm96-96H150a6 6 0 0 1-6-6V54a6 6 0 0 1 6-6h308a6 6 0 0 1 6 6v308a6 6 0 0 1-6 6z'));
var lattyware$elm_fontawesome$FontAwesome$Solid$bars = lattyware$elm_fontawesome$FontAwesome$Icon$view(
	A5(lattyware$elm_fontawesome$FontAwesome$Icon$Icon, 'fas', 'bars', 'svg-inline--fa fa-bars fa-w-14', '0 0 448 512', 'M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z'));
var lattyware$elm_fontawesome$FontAwesome$Solid$ship = lattyware$elm_fontawesome$FontAwesome$Icon$view(
	A5(lattyware$elm_fontawesome$FontAwesome$Icon$Icon, 'fas', 'ship', 'svg-inline--fa fa-ship fa-w-20', '0 0 640 512', 'M496.616 372.639l70.012-70.012c16.899-16.9 9.942-45.771-12.836-53.092L512 236.102V96c0-17.673-14.327-32-32-32h-64V24c0-13.255-10.745-24-24-24H248c-13.255 0-24 10.745-24 24v40h-64c-17.673 0-32 14.327-32 32v140.102l-41.792 13.433c-22.753 7.313-29.754 36.173-12.836 53.092l70.012 70.012C125.828 416.287 85.587 448 24 448c-13.255 0-24 10.745-24 24v16c0 13.255 10.745 24 24 24 61.023 0 107.499-20.61 143.258-59.396C181.677 487.432 216.021 512 256 512h128c39.979 0 74.323-24.568 88.742-59.396C508.495 491.384 554.968 512 616 512c13.255 0 24-10.745 24-24v-16c0-13.255-10.745-24-24-24-60.817 0-101.542-31.001-119.384-75.361zM192 128h256v87.531l-118.208-37.995a31.995 31.995 0 0 0-19.584 0L192 215.531V128z'));
var lattyware$elm_fontawesome$FontAwesome$Solid$tachometerAlt = lattyware$elm_fontawesome$FontAwesome$Icon$view(
	A5(lattyware$elm_fontawesome$FontAwesome$Icon$Icon, 'fas', 'tachometer-alt', 'svg-inline--fa fa-tachometer-alt fa-w-18', '0 0 576 512', 'M288 32C128.94 32 0 160.94 0 320c0 52.8 14.25 102.26 39.06 144.8 5.61 9.62 16.3 15.2 27.44 15.2h443c11.14 0 21.83-5.58 27.44-15.2C561.75 422.26 576 372.8 576 320c0-159.06-128.94-288-288-288zm0 64c14.71 0 26.58 10.13 30.32 23.65-1.11 2.26-2.64 4.23-3.45 6.67l-9.22 27.67c-5.13 3.49-10.97 6.01-17.64 6.01-17.67 0-32-14.33-32-32S270.33 96 288 96zM96 384c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32zm48-160c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32zm246.77-72.41l-61.33 184C343.13 347.33 352 364.54 352 384c0 11.72-3.38 22.55-8.88 32H232.88c-5.5-9.45-8.88-20.28-8.88-32 0-33.94 26.5-61.43 59.9-63.59l61.34-184.01c4.17-12.56 17.73-19.45 30.36-15.17 12.57 4.19 19.35 17.79 15.17 30.36zm14.66 57.2l15.52-46.55c3.47-1.29 7.13-2.23 11.05-2.23 17.67 0 32 14.33 32 32s-14.33 32-32 32c-11.38-.01-20.89-6.28-26.57-15.22zM480 384c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32z'));
var author$project$Main$tabItems = _List_fromArray(
	[
		{
		icon: lattyware$elm_fontawesome$FontAwesome$Solid$ship(_List_Nil),
		title: 'Library',
		viewMode: author$project$Main$Hull(author$project$Main$HullLibrary)
	},
		{
		icon: lattyware$elm_fontawesome$FontAwesome$Solid$bars(_List_Nil),
		title: 'Partitions',
		viewMode: author$project$Main$Partitioning(author$project$Main$PropertiesEdition)
	},
		{
		icon: lattyware$elm_fontawesome$FontAwesome$Regular$clone(_List_Nil),
		title: 'Blocks',
		viewMode: author$project$Main$SpaceReservation(author$project$Main$WholeList)
	},
		{
		icon: lattyware$elm_fontawesome$FontAwesome$Solid$tachometerAlt(_List_Nil),
		title: 'KPIs',
		viewMode: author$project$Main$KpiStudio
	}
	]);
var author$project$Main$viewModesMatch = F2(
	function (left, right) {
		switch (left.$) {
			case 'SpaceReservation':
				if (right.$ === 'SpaceReservation') {
					return true;
				} else {
					return false;
				}
			case 'Hull':
				if (right.$ === 'Hull') {
					return true;
				} else {
					return false;
				}
			case 'Partitioning':
				if (right.$ === 'Partitioning') {
					return true;
				} else {
					return false;
				}
			default:
				if (right.$ === 'KpiStudio') {
					return true;
				} else {
					return false;
				}
		}
	});
var author$project$Main$viewTab = F2(
	function (model, tab) {
		var classes = A2(author$project$Main$viewModesMatch, tab.viewMode, model.viewMode) ? 'tab-item active' : 'tab-item';
		return A2(
			elm$html$Html$div,
			_List_fromArray(
				[
					elm$html$Html$Attributes$class(classes),
					elm$html$Html$Events$onClick(
					author$project$Main$ToJs(
						author$project$Main$SwitchViewMode(tab.viewMode)))
				]),
			_List_fromArray(
				[
					tab.icon,
					A2(
					elm$html$Html$p,
					_List_Nil,
					_List_fromArray(
						[
							elm$html$Html$text(tab.title)
						]))
				]));
	});
var author$project$Main$viewTabs = function (model) {
	return A2(
		elm$html$Html$div,
		_List_fromArray(
			[
				elm$html$Html$Attributes$class('tabs')
			]),
		A2(
			elm$core$List$map,
			author$project$Main$viewTab(model),
			author$project$Main$tabItems));
};
var author$project$Main$viewPanelMenu = function (model) {
	return A2(
		elm$html$Html$div,
		_List_fromArray(
			[
				elm$html$Html$Attributes$class('panel-menu')
			]),
		_List_fromArray(
			[
				author$project$Main$viewTabs(model),
				author$project$Main$viewBuild(model)
			]));
};
var author$project$Main$viewSideMenu = function (model) {
	return A2(
		elm$html$Html$div,
		_List_fromArray(
			[
				elm$html$Html$Attributes$class('side')
			]),
		_List_fromArray(
			[
				author$project$Main$viewPanelMenu(model),
				author$project$Main$viewPanel(model)
			]));
};
var author$project$Main$viewWorkspace = function (_n0) {
	return A2(
		elm$html$Html$div,
		_List_fromArray(
			[
				elm$html$Html$Attributes$class('workspace')
			]),
		_List_fromArray(
			[
				A2(
				elm$html$Html$div,
				_List_fromArray(
					[
						elm$html$Html$Attributes$id('three-wrapper')
					]),
				_List_Nil)
			]));
};
var author$project$Main$viewContent = function (model) {
	return A2(
		elm$html$Html$div,
		_List_fromArray(
			[
				elm$html$Html$Attributes$class('content-wrapper')
			]),
		_List_fromArray(
			[
				author$project$Main$viewSideMenu(model),
				author$project$Main$viewWorkspace(model),
				author$project$Main$viewCopyright
			]));
};
var author$project$Main$OpenSaveFile = {$: 'OpenSaveFile'};
var lattyware$elm_fontawesome$FontAwesome$Solid$folderOpen = lattyware$elm_fontawesome$FontAwesome$Icon$view(
	A5(lattyware$elm_fontawesome$FontAwesome$Icon$Icon, 'fas', 'folder-open', 'svg-inline--fa fa-folder-open fa-w-18', '0 0 576 512', 'M572.694 292.093L500.27 416.248A63.997 63.997 0 0 1 444.989 448H45.025c-18.523 0-30.064-20.093-20.731-36.093l72.424-124.155A64 64 0 0 1 152 256h399.964c18.523 0 30.064 20.093 20.73 36.093zM152 224h328v-48c0-26.51-21.49-48-48-48H272l-64-64H48C21.49 64 0 85.49 0 112v278.046l69.077-118.418C86.214 242.25 117.989 224 152 224z'));
var author$project$Main$viewOpenMenuItem = A2(
	elm$html$Html$div,
	_List_fromArray(
		[
			elm$html$Html$Attributes$class('header-menu-item'),
			elm$html$Html$Attributes$title('Open')
		]),
	_List_fromArray(
		[
			A2(
			elm$html$Html$label,
			_List_fromArray(
				[
					elm$html$Html$Attributes$for('open-save-file')
				]),
			_List_fromArray(
				[
					lattyware$elm_fontawesome$FontAwesome$Solid$folderOpen(_List_Nil)
				])),
			A2(
			elm$html$Html$input,
			_List_fromArray(
				[
					elm$html$Html$Attributes$type_('file'),
					elm$html$Html$Attributes$accept('application/json, .json'),
					elm$html$Html$Attributes$id('open-save-file'),
					elm$html$Html$Attributes$name('open-save-file'),
					elm$html$Html$Attributes$class('hidden-input'),
					A2(
					elm$html$Html$Events$on,
					'change',
					elm$json$Json$Decode$succeed(
						author$project$Main$ToJs(author$project$Main$OpenSaveFile)))
				]),
			_List_Nil)
		]));
var author$project$Main$encodeCustomProperty = function (customProperty) {
	return elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'label',
				elm$json$Json$Encode$string(customProperty.label)),
				_Utils_Tuple2(
				'values',
				elm$json$Json$Encode$object(
					A2(
						elm$core$List$map,
						function (_n0) {
							var uuid = _n0.a;
							var value = _n0.b;
							return _Utils_Tuple2(
								uuid,
								elm$json$Json$Encode$string(value));
						},
						elm$core$Dict$toList(customProperty.values))))
			]));
};
var author$project$Main$encodeCustomProperties = function (customProperties) {
	return A2(elm$json$Json$Encode$list, author$project$Main$encodeCustomProperty, customProperties);
};
var author$project$Main$encodeBulkheads = function (bulkheads) {
	return elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'number',
				elm$json$Json$Encode$int(bulkheads.number.value)),
				_Utils_Tuple2(
				'spacing',
				elm$json$Json$Encode$float(bulkheads.spacing.value)),
				_Utils_Tuple2(
				'zero',
				elm$json$Json$Encode$object(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'index',
							elm$json$Json$Encode$int(bulkheads.zero.index)),
							_Utils_Tuple2(
							'position',
							elm$json$Json$Encode$float(bulkheads.zero.position.value))
						]))),
				_Utils_Tuple2(
				'spacingExceptions',
				elm$json$Json$Encode$object(
					A2(
						elm$core$List$map,
						function (_n0) {
							var index = _n0.a;
							var input = _n0.b;
							return _Utils_Tuple2(
								elm$core$String$fromInt(index),
								elm$json$Json$Encode$float(input.value));
						},
						elm$core$Dict$toList(bulkheads.spacingExceptions))))
			]));
};
var author$project$Main$encodeDecks = function (decks) {
	return elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'number',
				elm$json$Json$Encode$int(decks.number.value)),
				_Utils_Tuple2(
				'spacing',
				elm$json$Json$Encode$float(decks.spacing.value)),
				_Utils_Tuple2(
				'zero',
				elm$json$Json$Encode$object(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'index',
							elm$json$Json$Encode$int(decks.zero.index)),
							_Utils_Tuple2(
							'position',
							elm$json$Json$Encode$float(decks.zero.position.value))
						]))),
				_Utils_Tuple2(
				'spacingExceptions',
				elm$json$Json$Encode$object(
					A2(
						elm$core$List$map,
						function (_n0) {
							var index = _n0.a;
							var input = _n0.b;
							return _Utils_Tuple2(
								elm$core$String$fromInt(index),
								elm$json$Json$Encode$float(input.value));
						},
						elm$core$Dict$toList(decks.spacingExceptions))))
			]));
};
var author$project$Main$encodePartitions = function (partitions) {
	return elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'decks',
				author$project$Main$encodeDecks(partitions.decks)),
				_Utils_Tuple2(
				'bulkheads',
				author$project$Main$encodeBulkheads(partitions.bulkheads))
			]));
};
var author$project$Main$encodeTag = function (tag) {
	return elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'color',
				elm$json$Json$Encode$string(
					author$project$SIRColorPicker$getName(tag.color))),
				_Utils_Tuple2(
				'label',
				elm$json$Json$Encode$string(tag.label))
			]));
};
var author$project$Main$encodeTags = function (tags) {
	return A2(elm$json$Json$Encode$list, author$project$Main$encodeTag, tags);
};
var author$project$Main$encodeselectedHullReference = function (model) {
	var _n0 = model.selectedHullReference;
	if (_n0.$ === 'Just') {
		var hullName = _n0.a;
		return elm$json$Json$Encode$string(hullName);
	} else {
		return elm$json$Json$Encode$string('');
	}
};
var author$project$Main$encodeModelForSave = function (model) {
	return elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'version',
				elm$json$Json$Encode$int(2)),
				_Utils_Tuple2(
				'selectedHullReference',
				author$project$Main$encodeselectedHullReference(model)),
				_Utils_Tuple2(
				'hulls',
				author$project$EncodersDecoders$dictEncoder(model.slices)),
				_Utils_Tuple2(
				'blocks',
				author$project$Main$encodeBlocks(model.blocks)),
				_Utils_Tuple2(
				'coordinatesTransform',
				author$project$CoordinatesTransform$encode(model.coordinatesTransform)),
				_Utils_Tuple2(
				'partitions',
				author$project$Main$encodePartitions(model.partitions)),
				_Utils_Tuple2(
				'tags',
				author$project$Main$encodeTags(model.tags)),
				_Utils_Tuple2(
				'customProperties',
				author$project$Main$encodeCustomProperties(model.customProperties))
			]));
};
var author$project$Main$stringifyEncodeValue = function (value) {
	return A2(elm$json$Json$Encode$encode, 4, value);
};
var author$project$Main$viewSaveMenuItem = function (model) {
	return A2(
		elm$html$Html$div,
		_List_fromArray(
			[
				elm$html$Html$Attributes$class('header-menu-item'),
				elm$html$Html$Attributes$title('Save')
			]),
		_List_fromArray(
			[
				A2(
				elm$html$Html$a,
				_List_fromArray(
					[
						elm$html$Html$Attributes$type_('button'),
						elm$html$Html$Attributes$href(
						'data:application/json;charset=utf-8,' + elm$url$Url$percentEncode(
							author$project$Main$stringifyEncodeValue(
								author$project$Main$encodeModelForSave(model)))),
						elm$html$Html$Attributes$download(
						author$project$Main$getDateForFilename(model) + ('_Project_Shipbuilder_' + (model.build + '.json')))
					]),
				_List_fromArray(
					[
						lattyware$elm_fontawesome$FontAwesome$Solid$download(_List_Nil)
					]))
			]));
};
var author$project$Main$viewHeaderMenu = function (model) {
	return A2(
		elm$html$Html$div,
		_List_fromArray(
			[
				elm$html$Html$Attributes$class('header-menu')
			]),
		_List_fromArray(
			[
				author$project$Main$viewOpenMenuItem,
				author$project$Main$viewSaveMenuItem(model)
			]));
};
var elm$html$Html$h1 = _VirtualDom_node('h1');
var elm$html$Html$header = _VirtualDom_node('header');
var elm$html$Html$img = _VirtualDom_node('img');
var elm$html$Html$Attributes$src = function (url) {
	return A2(
		elm$html$Html$Attributes$stringProperty,
		'src',
		_VirtualDom_noJavaScriptOrHtmlUri(url));
};
var author$project$Main$viewHeader = function (model) {
	return A2(
		elm$html$Html$header,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				elm$html$Html$div,
				_List_fromArray(
					[
						elm$html$Html$Attributes$class('header-left')
					]),
				_List_fromArray(
					[
						A2(
						elm$html$Html$img,
						_List_fromArray(
							[
								elm$html$Html$Attributes$src('assets/NAVAL_GROUP_Logotype_blanc_sur_bleu.png')
							]),
						_List_Nil),
						A2(
						elm$html$Html$img,
						_List_fromArray(
							[
								elm$html$Html$Attributes$src('assets/SIREHNA_R.png')
							]),
						_List_Nil),
						A2(
						elm$html$Html$img,
						_List_fromArray(
							[
								elm$html$Html$Attributes$src('assets/HOLISHIP_LOGO_Transparent_background.png')
							]),
						_List_Nil),
						A2(
						elm$html$Html$h1,
						_List_Nil,
						_List_fromArray(
							[
								elm$html$Html$text('ShipBuilder')
							]))
					])),
				author$project$Main$viewHeaderMenu(model)
			]));
};
var author$project$Main$toastTypeToString = function (toastType) {
	switch (toastType.$) {
		case 'Error':
			return 'error';
		case 'Info':
			return 'info';
		case 'Processing':
			return 'processing';
		default:
			return 'success';
	}
};
var lattyware$elm_fontawesome$FontAwesome$Solid$check = lattyware$elm_fontawesome$FontAwesome$Icon$view(
	A5(lattyware$elm_fontawesome$FontAwesome$Icon$Icon, 'fas', 'check', 'svg-inline--fa fa-check fa-w-16', '0 0 512 512', 'M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z'));
var lattyware$elm_fontawesome$FontAwesome$Solid$exclamationTriangle = lattyware$elm_fontawesome$FontAwesome$Icon$view(
	A5(lattyware$elm_fontawesome$FontAwesome$Icon$Icon, 'fas', 'exclamation-triangle', 'svg-inline--fa fa-exclamation-triangle fa-w-18', '0 0 576 512', 'M569.517 440.013C587.975 472.007 564.806 512 527.94 512H48.054c-36.937 0-59.999-40.055-41.577-71.987L246.423 23.985c18.467-32.009 64.72-31.951 83.154 0l239.94 416.028zM288 354c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z'));
var lattyware$elm_fontawesome$FontAwesome$Solid$info = lattyware$elm_fontawesome$FontAwesome$Icon$view(
	A5(lattyware$elm_fontawesome$FontAwesome$Icon$Icon, 'fas', 'info', 'svg-inline--fa fa-info fa-w-6', '0 0 192 512', 'M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z'));
var lattyware$elm_fontawesome$FontAwesome$Solid$spinner = lattyware$elm_fontawesome$FontAwesome$Icon$view(
	A5(lattyware$elm_fontawesome$FontAwesome$Icon$Icon, 'fas', 'spinner', 'svg-inline--fa fa-spinner fa-w-16', '0 0 512 512', 'M304 48c0 26.51-21.49 48-48 48s-48-21.49-48-48 21.49-48 48-48 48 21.49 48 48zm-48 368c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zm208-208c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zM96 256c0-26.51-21.49-48-48-48S0 229.49 0 256s21.49 48 48 48 48-21.49 48-48zm12.922 99.078c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.491-48-48-48zm294.156 0c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.49-48-48-48zM108.922 60.922c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.491-48-48-48z'));
var author$project$Main$viewToast = function (toast) {
	var icon = function () {
		var _n0 = toast.type_;
		switch (_n0.$) {
			case 'Info':
				return lattyware$elm_fontawesome$FontAwesome$Solid$info(_List_Nil);
			case 'Success':
				return lattyware$elm_fontawesome$FontAwesome$Solid$check(_List_Nil);
			case 'Error':
				return lattyware$elm_fontawesome$FontAwesome$Solid$exclamationTriangle(_List_Nil);
			default:
				return lattyware$elm_fontawesome$FontAwesome$Solid$spinner(_List_Nil);
		}
	}();
	return A2(
		elm$html$Html$li,
		_List_fromArray(
			[
				elm$html$Html$Attributes$class(
				'toast toast__' + author$project$Main$toastTypeToString(toast.type_)),
				elm$html$Html$Events$onClick(
				author$project$Main$NoJs(
					author$project$Main$DismissToast(toast.key)))
			]),
		_List_fromArray(
			[
				icon,
				A2(
				elm$html$Html$p,
				_List_Nil,
				_List_fromArray(
					[
						elm$html$Html$text(toast.message)
					]))
			]));
};
var author$project$Main$viewToasts = function (toasts) {
	return A2(
		elm$html$Html$ul,
		_List_fromArray(
			[
				elm$html$Html$Attributes$class('toasts')
			]),
		A2(
			elm$core$List$map,
			author$project$Main$viewToast,
			author$project$DictList$values(toasts)));
};
var author$project$Main$view = function (model) {
	return A2(
		elm$html$Html$div,
		_List_fromArray(
			[
				elm$html$Html$Attributes$id('elm-root')
			]),
		_List_fromArray(
			[
				author$project$Main$viewHeader(model),
				author$project$Main$viewContent(model),
				author$project$Main$viewToasts(model.toasts)
			]));
};
var elm$browser$Browser$element = _Browser_element;
var author$project$Main$main = elm$browser$Browser$element(
	{init: author$project$Main$init, subscriptions: author$project$Main$subscriptions, update: author$project$Main$update, view: author$project$Main$view});
_Platform_export({'Main':{'init':author$project$Main$main(
	A2(
		elm$json$Json$Decode$andThen,
		function (hullsJSON) {
			return A2(
				elm$json$Json$Decode$andThen,
				function (buildSHA) {
					return elm$json$Json$Decode$succeed(
						{buildSHA: buildSHA, hullsJSON: hullsJSON});
				},
				A2(elm$json$Json$Decode$field, 'buildSHA', elm$json$Json$Decode$string));
		},
		A2(elm$json$Json$Decode$field, 'hullsJSON', elm$json$Json$Decode$string)))(0)}});}(this));