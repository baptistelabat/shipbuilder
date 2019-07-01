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
var elm$html$Html$Attributes$src = function (url) {
	return A2(
		elm$html$Html$Attributes$stringProperty,
		'src',
		_VirtualDom_noJavaScriptOrHtmlUri(url));
};
var author$project$Logos$holiship = elm$html$Html$Attributes$src('data:image/png;base64,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');
var author$project$Logos$navalGroup = elm$html$Html$Attributes$src('data:image/png;base64,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');
var author$project$Logos$sirehna = elm$html$Html$Attributes$src('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAEuEAAAW9CAYAAADhXUhbAAAACXBIWXMAAC4jAAAuIwF4pT92AAAgAElEQVR42uzBAQEAAACAkP6v7ggKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACA2buj5DZuZg2gjVv/vgKvbIYrG2ZlfR8IOZQsWZQ0JAHMOVWpqBy/pDki0QD6IwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD4P3v3mtzGjqQBFLjR+3JxZapaGeGVVf8gZEs2aT1YDwB5TsRETMx030uiAGSiJHwCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIC2ZUMAAAAAAAAAAAAAAAAAALGs6zqllKZv/tdLzrkYRQA+qDXzd/+7OefZCAIAAEcQwgUAAAAAAAAAAAAAAAAAA3gQrPVy4EcoKaWfb/8PQlQAhqs1f+7rP9L3Qx2/a/mz/giHBAAAvksIFwAAAAAAAAAAQMMeXJzskguXp86j4cbefLIHmlv2EftPvF6iIaEv9p6wH7hIbX6pGwAf75kvHX30xR6pFqNfpov9YEq/3yecEbKl3sSaY8MZed55dnq26NQVgEH3d0MAAAAAAAAAAADQrvpL1C+DfJ2Sc754qqfMo3W075Rz9juQ5u5eLi6vDl+Pws2REeuAGnTaXJpSSlc9JPYrewZwSg2eUp8hKJ+q9ymln0mYkFrM1mvqtR+ZDQmfWP+v8+QlwNpQb9qZc8POt5HPgp6dno27lrf1Rp0B6LAHMAQAAAAAAAAAAADtGvAX2YUonDOPhBlg/7NP2UsC70FC1Da1RL7AfuI+sAgOMMfUDCDgeSgF7uFKEpKiFrPn2hLMZa1Paexwxy+dN62JU/sdQU6enWenZ9N/AdBGD2AIAAAAAAAAAAAA2jXwL7JfXKI8dB4JM6C3OTullK4nfgRhL20+l5Z0N0fWdb0mF2ufFTqkr4G+VP+ob9W3AqP32lMShvKw/04CudRirC+2ONOlJKT7n+f+JATy6DkpyMmz8+z0bFH7L6FcAK31AIYAAAAAAAAAAACgXYP/IrsghePmkTADepuzLYQF2aPafTbq2Pee3ZSEqNkX+p4/oUPQ9K36VmDY+jolYShfJTBILWbHnjul9FMgxFBrek4CHtWctuenICfPzrPTs+m/BEACNOE/QwAAAAAAAAAAAMBJrvXCKcAvby6in81F+PsWQ9DnHKkXeIrH9v25H/wSVAvzfdI7AjDCeWdd17lemr86d3y7L7muN7PhgG177pTSS11f3t32W2vm+vzWumd6jhvVHGsCgL36L/UG4HxCuAAAAAAAAAAAADiTy1zAX/tCI59D2MsdNYRIEFencyTnfPHYvj12c9Tv3lA4Yks1AgC+Wk8Fb+1DWBDseOZNAu+6OrcJ3tq/5lgTABxYb67qDcCxhHABAAAAAAAAAABwNhclgZRSSuu6thauIuzljhpGVIxEt3NEiNrXXczzpmrFbEoC0Mn55s9AFPYzJcEosKcX66vZWvM25HEyIoevCT/bAGDPM86vHky9AdifEC4AAAAAAAAAAABa4K/5QnD1AsHU4OeyN90nyKnTOSJE7ctKzrmY3015cekMgNbrp0CU03sFYUGw7/oSWn5unRHy2I4pCYEE4IAerNYb4Y8AOxLCBQAAAAAAAAAAQCteXOCC2HtAw3vT5PG8V0OJipHodo4IUTNWH6rzutm92dQEoMHaOQtEaa5PF4oC+5isr3POaPX9uZBHdQeAoD1YEsYFsBshXAAAAAAAAAAAALRkEsQF8dTLaVPDH9El+jtyzhej0OccqSFqgrg+ttSxMq/b7BknUxSAVs4zwrfa7mmEooD11XmdEb5lXQDAW1MSxgWwOSFcAAAAAAAAAAAAtEYQF8TT+mV1YS+PCXLqdI7knGePzRg9Uudz63NavwjA2fVS+FZn506X1MH66u1cJnyr+3UhjAuAPU3pFsal1gBsQAgXAAAAAAAAAAAALRLEBUF0tNbtSXfUkKJiJLqdIxePzdj0PJ/1iwCcVH+Eb/VrSrdL6noI2G99zYbi6TojfGsswrgAOKrW6BsAniCECwAAAAAAAAAAgFYJ4oLB1QsBU0ef155032IIfs2RuafPm3MuSYjaPaWOTdR53NNeN7lcBsCR55daJ4Vv9W9ySR128+L9yVO1Zk7Ct0ZeG2oPAHsSOAzwBCFcAAAAAAAAAAAAtMylSBhbb5fXhb3cIcjp/ZzucI4IUft7Tl+ifvfewhE7rSUA9Fkjr0koyohcUod9eKf7jbPYuq6r802c2mN9AKAPA2iLEC4AAAAAAAAAAAB64FIKDGZd1zn1eYHdZcg7IocW9T5HaoiaIK7fFvO3O1OtKQCwy7mlhqJMRmNYLqnDfrzT/bjOTG+CHglUe+r6cJYFYM8+TJ0B+AIhXAAAAAAAAAAAAPTCpS0YS69hVsJeHhPE9XuOdFWvcs7m9E2JPBYdhyP2XFMAaLcuvoaiqDFxXOszB6ytI89g1yToMbKXdV393AOAXeuMYQD4HCFcAAAAAAAAAAAA9MSFFBjAAL/07yL+HTnnklIqRuJWrzr8zELUUlqCf/+u9zYXygDYsKZMSShKVJOeAqytA88v3i+Rar9xFfoPwJ59mJ+vA3xMCBcAAAAAAAAAAAC98YvC0LG6fqcBvofLo/cthqDPOSJELZU6BuZrvyY9IgAb1US9fmzTeqOvgO3XVvj9dV3XaV3XNQl65G8v1ggAe/Vhyc/XAT4khAsAAAAAAAAAAIAe+cvw0K+XQb6HsJc7aoiRIK5+58gSeO5eon73UcIRB6sxAJxQD4Wi8AeX1GGfc3LYkKH6PlvIEh+tEUGQADjjAJxACBcAAAAAAAAAAAC98pfhoTP1suE00j7kqf4t5zwbhT7nSOAQtcU8HcYkqBWAb5xTpiQUhfuEwMM+PXu4Pbd+Z++RUH8AaKHGTIYB4G9CuAAAAAAAAAAAAOjZJIgLujLaZUNhL49dDEGfcyRgiFqJHBw3YDhiSreg1ikBwOdq4TUJ4OLj3sIcgeBn5SfqzLSu6zrguQv1B4B+CeICuEMIFwAAAAAAAAAAAL0TxAUdGHidCnu5I+dcUkrFSNzmSIefOVKI2mJ++l4AhD6j6OX5DO+eYIeeffT3KfX72TtQfwBokSAugD8I4QIAAAAAAAAAAGAELqNAw+ov8k8Df0VhL/cthuDXGuiqRgUKUVvqdzUvx+wNpwQA/66DagVf7S+8e4JtDRv+IICLreuPMy4AejGAfQnhAgAAAAAAAAAAYBQuQ0K7Rg+pEvZyRw03EsTV6RzJOV8CzNE56oQMEI6YkgvvADyogeu6rkkAF9/v6/UYsK3h3hnVfcJewab1JwlKAWAf6gtAJYQLAAAAAAAAAACAkUzrzWQooA3rus4pxgV3lyvvqCFHxUiklPq8WDxyiNrFfAxTgwDgtS5M+nY2IIgLrKl/1ZprEvTIfgSlALCHF0MAgOOesgAAIABJREFUIIQLAAAAAAAAAACAMbmMAu0I88v7wl4eWgxBSul2sbirOTJwiFrJOZeoEzFQOGJKKb3oCQGo9W9KArgI3NtDB2uq+75dABcH8bMPAPboxZyXgfCEcAEAAAAAAAAAADAql1HgZAF/aV/Yyx017KgYidsc6fAzjxiitpiHvi8Aoc4lUxLAhfMftK7rfVoAF0evFzUIgI1NagsQnRAuAAAAAAAAAAAARuYyCpykrr2I60/Yyx0554tR+LU2rp09u5LGClFb6ncy/+JwgQzAuUQAF3vx3gm23bPnjs9Z9gLUIADUFoCOCeECAAAAAAAAAABgdH5hGM4RNYxK2MtjiyHoc44MFKJWcs5z1IkXOBwxJeErAKHfCRgCzDHoxktv5+UaHDZ5dJxVg7yHBGDrfswQAFEJ4QIAAAAAAAAAACACl1HgQC4guoR9Tw0/KkYipdTnRZYRQtQW8y50bbI3A9j7wVwD55Yt1/6UBFVwPjUIgC1N9Wd8AOEI4QIAAAAAAAAAACCKq0uRsD8XEH+Ng/3mvsUQpJQ6vMgyQIhayTmXqBNOOOKvdRd9DACi9eP2fY7sM5wBIVDfXj+jdU9LfQ8AbEXIKBCSEC4AAAAAAAAAAAAicSkS9ueX83/vN5NheK+GIBUj0e1aWTqeexfzDeMAEIMALpwBQd++c52ZkgAu2qtB5iQAW5+rAUIRwgUAAAAAAAAAAEA0LqTATuolxMlI/CLs5Q5hSO/WzLWzZ1dSnyFqi3nGmz5wNgwAziSwE30XbNe3t7yXe9+D8y4A+jGAwQjhAgAAAAAAAAAAICJBXLAP6+rvvWY2DHcJ4vo9R6aePnCHIWol5xx2HQoiucuFeYCx654zCWfPQ3MQBu7b6xp3xqLZdSMwBYDR+zGAvQjhAgAAAAAAAAAAICpBXLAhYVMPuaRwR865pJSKkUgp9RkUsfis5lfnNcu4AOi9YS+TABQYcy0JOcZ7AAD0YwDjEsIFAAAAAAAAAABAZNO6rle/QAzPqWvIhffH4+Py232LIfg1R+aePm/OeU59hKiVGvhmXnGvB9T/AYzXc9vbaYUzIGzUtzdUZyZrm876IgDYgp/9AWEI4QIAAAAAAAAAACC6KaUkiAue45fwP9hn7DF/q+FIgrjqGupwjiwdzLFL1AklHFHtAghY9/TbtDYvBaDAWD278wM98S4SADUF4IuEcAEAAAAAAAAAAMCNIC74BhfeP81lzTtyzrNR6HOOdBCidjGf+MC0rqs9CGCQ87whoNFew1kZntTCOqrnBusZ/REAYc82hgCIQAgXAAAAAAAAAAAA/CaIC76xbgzBpwh7eexiCH7Nka5qUMMhaqWGhIUkHPFLXvR+AN3XPecRmu41DAE8f1Zu4HxlLaNPAsC5BmBwQrgAAAAAAAAAAADgPUFc8ElCpb5M2MsdNSypGIlbDerwM7cYoraYR3xlbzYEAN2eR6YkeJK2Tc6AbZ0TcgfqeWbxuJrp150XUIcAgvVs6fbOe0l+bvH2/D0bBWB0/zMEAAAAAAAAAAAA8Jfruq6XGgwD3FEvcLmI+HUvycWNe5YkQOF1bc0557mXz5tzLuu6loae3xK5frsM9S3Tuq6Tvg+g296a7fpxY7+Pa0opGwa+cMZ67ennN+9eQp+Xz+rXhT2eWmt+GHt1CODEfqykNz/Hqe9co9emH2YGMDohXAAAAAAAAAAAAHDfdV3XknO+GAq4y6Xr7xH2ckcNclrMq9vaqvWnpznSTIhaTwFmWxOO+Fzfl1xKBuit7s1JOMdXlZTSz416pvmPHmRyTvz3fI3cp/LcWTmlVIRxpSmdE2h+NQtPrTV/1v2UBKCoQwDn9GTzm7NP1P5A/QWG958hAAAAAAAAAAAAgIemdV1dtoI//HHJmq+zr9xRL7IUI5FS6iy8oF4MXxr4KBfzhidq22wUANS9wZSU0pJ/u+ScNw/hyDmX139uzjnXnmzR25uvbL7OLoHPPIevIeeDL1lSSpeda81rnXn992S15mtrqL7PBeD5nixHrT/6I2B0QrgAAAAAAAAAAADg3wRxwd+siSe5rPDQYgh+1Z6ppw+89QXbbyg1DCzqnjIl4YjPcikZQC89gpJ+B29dzujR3oRyvQYGRe7xl9fnYWqy1fpKwocPOx8Ygg/3t9dArPmM8/jbUK4kkMucBji2BkUORwUYlhAuAAAAAAAAAAAA+JggLqhceN+MsJc76qXNYiRSSn2G3Z158WgxX9hibzYEAPbrTp0avPWv/r6GpOQg/dry5lm8BtM4Q7PHuTlc6MOR71C8+3qovNnj5paCsIU/fsrkXSSAnsxZHOAxIVwAAAAAAAAAAADwOYK4CK9e1PJL9tsxlnfUS5Ok/i7+nhiitrR0+dc86b7fmwwDgLrXkV9hKB30iiOGcZX6fS5Ctzjh7BXt7Hxkn+59zd973aW1oMdHayNY+KO5DXB+T6beAAxCCBcAAAAAAAAAAAB83rSu61U4A4G5qLX9nmI/uc/FlbrmOpwjRz+7EjnoQDjiLoSuAjiTdNFz9RK+9ac34Silw3Ev6X3o1qV+n2JKcsJaKs7Ou5yxZqPwzmv4VulwjczpFlZnj/7Nu0iAfepNmFqjVwJGJoQLAAAAAAAAAAAAvmZKKQniIpw658377Ql7uSPaxZUPvHT27Eo69iL4Yn6wQ82zNwO0uT/PRiGVXsO37vSNl3QLR2ndkn6Hngndwtl5/LOPM9b7elM6XyOlo3pzlMkQAOxytgGgc0K4AAAAAAAAAAAA4HsEcRFuzhuCfQh7eWgxBCmllKbe6s2BF8FL5AAE4YjWHUBA0YNRLqNd7q7hKDm1FSL0NnQr19Ct2fLD2TnEGctaV2/0UwDoyf7th0cNjEoIFwAAAAAAAAAAAHyfIC5CcAlxd8Je7qjhSsVI3OpNh595OWCOXMwLduRiMoAzSStKugWiDNsb176unDi+Sx1joVs4OzsDRFbqPjh6vYn+LsG7XoB9akyUvXXytIFRCeECAAAAAAAAAACA5wjiYmh1fgsi2Z8xvkPI0ru1OHf27Era9yL4Yj6ws8k4AzTlR9DvXXLOQwdw/dH7H9HjlfQ+dOtSg7eKZUbHfgY5B009/rN7qjcRvmjd76O/b/IeEmAfiyEA6JcQLgAAAAAAAAAAAHieIC5G5lLWMYS9PCaIq67F3mrNjhd4S8457HoRjqgGAgStfRHP3CVaKG3t8fb4zktKaRG6xeBrJ4I9a0Hk3n8JWG9KrTdha4GfZwDsc4YzBAD9EsIFAAAAAAAAAAAA27iu63o1DIykhkJNRuIwwl7uqBcji5Hodo4snfwzzQMe1UL9HcD5Ip5JwgVw/dH/P9vvvQ3dyjV0a7aUGH3fMARqzTdcou6POefXWht17Xi3ALDPWWZ4ghyBUQnhAgAAAAAAAAAAgO1MghoYjMtYB7OHPLQYgl91Zu7pA9fLvGXDf2SJcpnpwR4xJeGIZ6w7Yw7gXHKksAFcT/SQpZ4ZLkK3COynIfj2OSvqfrFEPl+/qTlRa65zLsBO9VUNAeiTEC4AAAAAAAAAAADYliAuhmAen7qHTIbhvXopVBDXTY8hFMuGc+ES/Pnbm607gGjnkmi9cdHvvOv7yqNxSu9Dty41eKsYOQIz/7/vR8T5IqzwnZC1N3AAHQAA/EUIFwAAAAAAAAAAAGxPEBddqxfdJyNxGmEvd7gc+m6NXjt7diVtcyH84rlzYm9nDwI4aQ8O1vMK4Ho8HktKaRG6Bf88d6HWfIbAx/vrJ+KY/PD0AQDgRggXAAAAAAAAAAAA7EMQFz0TAnX+/jEbhrtcEv09R6aePvAGF3xL5EvlwhHbqI29rTsAZxO97gjyb7NgXmCHs1a4fUUA18NxKekW+BiJMy7A9vXEmQWgU0K4AAAAAAAAAAAAYD+CuOhOvXw4GYnTCXu5o16ILEbiNkc6/MzLSf9dzxvPAaDPs0mkfniJHDgKcKIfwb6vAK5/qMEpoeqxPwQAAAA3QrgAAAAAAAAAAABgX9N6MxkKOiFgxLNo3WIIftWXuacP/MRl1tChFMIRm1t3ngXAgftukO9Zap8EgFqzd70pHvmHvHcCAICAhHABAAAAAAAAAADAMa5CG2jduq5Xo9AUYS931AujLkTe9BjUtnzjmc+eMy31dIYA4DA/gnxPvS3ACaK9c8k5Xzz1T41TCVabvXMA0F8AkIRwAQAAAAAAAAAAwJEEcdGsOjfNzwb3DUPwtxrKVIxEf+F59TLrV57dxfOlwecyGwWAQ0Q4n5TaHwE826NORkGd+QeBj18gDBwA/QVAPEK4AAAAAAAAAAAA4FiCuGjViyFok7CXh1wgvZl6qys5588Ga4UOpRCO2HbN1M8BHFIH9bQAXzgbGoIv+xHliwqVUqM/6LvMDwAAwhPCBQAAAAAAAAAAAMcTxEVT6kUrc7Jdwl7uqOFMxUjc5kiHn/nyiWd88VzxfADCitD/hg4cBVBrDiPw8RsElwHwTcOHfKqRwKiEcAEAAAAAAAAAAMA5rv7CPA0RJOIZdUlI0y9TbzXlEyFqoS8JC0fsZt15RgD7+RHgOwpFAbbkvQGPzt+zUVCr9V0Ah5kMAUCfhHABAAAAAAAAAADAeV7Wdb0aBs5kDnZD2MtjwgtqTRno2RWXhF2g74QaCrBj/zv6F6yhpABPi/K+YMtzYqA/jqDWNDLn9F0AIXqy2SgA9EsIFwAAAAAAAAAAAJxrEoLEWeolzclIdMNecUe9EFmMRH+hejV44l4Q1+I54nkBMDhBssCWJkOAerObYggA+KQfhgCgX0K4AAAAAAAAAAAA4HyCuDjLiyHoi73iIZdKf9eTqacPXEPU3io1nCvqGp+SC/TWHYCeN8K+WjxpYEPe73xdiJCMyOfrDf0M0n/NHjXA0+fYCGdZP4sBhiWECwAAAAAAAAAAANogiItD1YtVk5Hocq/w3P5QL5UWI5FS6vPy9eXNs7x4fnhuAHreIP0rwNMCBedsHfgwGTM+WbNnowDAJ3g/CNC5/xkCAAAAAAAAAAAAaMa0rutVAAkHcSGg72dXDMN7OefLuq6rkUjTuq5zT5dEc85lXdeSUvoZ+cEJR7TuAAgjbChKDRTW7/xWBLKxwZryfgcO2K/VLwCcc37VRIAhCeECAAAAAAAAAACAtkw1RObiIiZ7Wdf1ahS63yeEvdx3SSmZ37dL2F3NDwGUv54b1h0AjF4vJ8PwTjEEOENYKzuds51PtvMzQP364TEDfF0N4ArzMwk/uwZG9p8hAAAAAAAAAAAAgCZd6y9uw6aC/UXukQnruaNeAClGQtie54XnCKDXbbhnnYPWydlZFDbvPcOsqS0DH7xz5RtKgO9oXQA4v6qHQGhCuAAAAAAAAAAAAKBdgrjYg/CmQQh7eWgxBCmllCY1pJu1PCWXXa07ABi/33EWhW3fB0TqO8vWfXuAMfNuZENbhsABoCfr2E9PHRiZEC4AAAAAAAAAAABomyAuNrOu65ziXAgoAb6jsJc76sVIl01rDTEEXYgSSFE8TwAIUw/VR9hJwLCHlAQ+AABt9WPTuq5rtJ4s5zx7+sDIhHABAAAAAAAAAABA+wRxsZUwQS8554tnGpfLIL/V8D3afj5RavySUoqwN0/WHQD/EC5Ipr7PmDx6eH4tRQx7cMansTMtAHqyOfnjFwBDEsIFAAAAAAAAAAAAfbgKdOAZ67qGuRTwJoArwuU4YS+PXQxBSimlF0GObT+fIN+z5JxLzrmklIp1BwChuKAOT6jhW9fAa6mYBV8nuAwAduvJov5hFGGUwPCEcAEAAAAAAAAAAEA/XiIFKbGdGgQyBfm6vy4CBLpwKOzljkBhP5+aI4agyb05Yjjiu33augMA/Q7wcP3Mb8K3Ip/5f5oNcNy+YxQA3u2LU+3J1ug9mYBPIIL/GQIAAAAAAAAAAABOcEm3YILJUHzZtK7r9Y8wC/hIlIvP5c5FgCXFCEJ5SQKn7lnUml+1Y6rBZDQgajhiSreAvHVdS4Dvb90BoN/Ri2Mef9UP6+Y9gQ8AwAk9m57svWIIgAiEcAEAAAAAAAAAAHC4GkZQ1nUN/VeDnyCIi09b13UO9HWXO/vNvK7rS5B9QdjLnXqzrmuUILaPXFNK2TA0I8qcLA8uzUcJyLPuAIjef0L3Z23nyXPPE4YAANCznW4xBEAE/xkCAAAAAAAAAAAAzlJDpIqR+JaphpjBQ/Wvf0cKenm0n0QJrLMn3K81s1rza0+YjUIzz2EK8nWXB+uyRFmX1h2AffNOb+o5AjxxngAA4NBzbDEKQARCuAAAAAAAAAAAADiVIK6nCOLiI2H+8nfdSx79/0oS9hKdi7t1T6jhfJy3RqckHDHaurTuANDvAGx/ngAAYH9+tgKEIYQLAAAAAAAAAACA09XwHL/E+z3TejMZCt6qcyLKvFg2+s+MQNjL/TpTksDHX3PEEBj/A/s769K6A0C/A/AdPw0BAMC5cs6zUQCiEMIFAAAAAAAAAABAE+ov8V6MxLddBe/w55wI8j3LZy4BCHvho0CgQCb14hzCEZ/6z1l3AHEM3bOPXg/WdZ0D9TvAvmf42SgAAJzKH9ACQhHCBQAAAAAAAAAAQDNqSI6QlO8TxEVK6dfF5yiWnf6zPRP2Yg58WC8MgXHfUfnshflgAYnWHcDna8PQvfrA59ApCQQGnN0BAEY5n89GAYhECBcAAAAAAAAAAABNEcT1NEFcwQW7+Fy+cklf2Av10kgxEuHC+oz3sZad//M9zwN7MwAjE8AFbKEIfAAAOJ2f1QPhCOECAAAAAAAAAACgOYK4niaIK7YwF59zzt/ZJ4S9sBiC216hVhy2FqckHPGjvq8EGZ/JugNg4H5HjQOc2aFjAvAAqL78jhdgBEK4AAAAAAAAAAAAaFLOueScc4oTyrA1QVwBBbv4/K1LmcJeCDYHPvJiCIxzI3vzxXwAgK4JAAa2IPBhI94HAQBPEIoKhCSECwAAAAAAAAAAgKbVUIZiJL7luq6ri7DBnnmQ71lyzvMT//1IFwiEvTyuLQhq2120cMQnL8wvgdbdbHUAhPVjwH7HewdgszOFIdju3GEINucdGwAh+jGhqEBUQrgAAAAAAAAAAABoniCup0yGIIZggR5PXcqsFwii7CnCXh4TxHUjNMH4btWvzWf+9zvj8jaAM/oo59Apee8AbEPgAwDAuUqwd7QA7wjhAgAAAAAAAAAAoAuCuOCxevE5SqBH2ehS5hJoigh7uV9Xirryaw8RxLXPuM6Bvu5WoXaLdQcAXVHPgC0IfNjeD0MAAHxF/Vk8QFhCuAAAAAAAAAAAAOhG/eVfvwAMf4sUsrRJQEu0ACZhL/vOpwFMNcyP7dbclIQjfmdvnq07AEbv00cJ6gwWOAoMdDYPcu5w1lDzAOAr/PwdCE8IFwAAAAAAAAAAAF2pIQ9+ERiqGuAxBfm6y1ZBL6//vEBTRdjL45oiiOvmxRAYz0b20sU8AQjvpyHo4hyqjgGb9P8bv+vh/V4NzuIAfOSiHwMQwgUAAAAAAAAAAECHBHHBO9dAa3/eYS8R9qKmzEYhpXQLajMWGxCOaE1adwAE6MudLYAtFGfyfc8bhkDdA4BP9GPFMAAI4QIAAAAAAAAAAKBTgrggpWDBHbusd2Ev7Dm/OuRS6TaEIz4vVEBiDW4DgJ7OoWoX8KyScz7zLF6c8flk3VPzANCPAQQghAsAAAAAAAAAAIBuvQniKkaDaOoFsCiX6fb+S9yhwl6snof1RC257S1Xo/DU+M2Bvu5lxzU5B5s69maAYHWg154h2DkU2NfZ72J+BjmjTqba06KMYfGoAUIRwAXwByFcAAAAAAAAAAAAdC3n/PpLwsVoEEyki8+7XsyMFvYiZOmcedaRySXdb6+tKQlHtCatOwA+54dzKBDY5YDzBPWsYQjUvs+wJrcXLKgd6IsALoA7hHABAAAAAAAAAAAwBEFcRFKDOqYgX3c56BKYsBd1pCRBXK+EKxi30/fMaAGJKSUBiQCxdNeT1yAJ5wjgWa0EcJUg4+18/1ztU/fA3gKjEcAF8IAQLgAAAAAAAAAAAIYhiItAroHW9TzSv8cc6mK+qSO3UIjZMHyecMTdXILNI+sO4E29idBzdfZ5hS0AT/f3jQRwpVY+h3OG2qfvAuBAArgA/kEIFwAAAAAAAAAAAEOpvzzs0gjDWtc1UnjS0ZcBlmBzabaizIN/ELLwNcIR9/l3lRQrGO+lBroBoN9yDgVGc4kUfNWYH4bgW7VvSnHCtrH2gPEJ4AL4gBAuAAAAAAAAAAAAhlPDIfwiMcMJdvmrHH0588hgmUYIe7k/D0qKFfrzrz1H2MLnxinS3rEE+XeeujdbVQC384A+wjkUGEarAVxRzhqT9z/OZvquc9ae/hVoqBfzc3OADwjhAgAAAAAAAAAAYEj1YpdfKGY0kS5/LcH+veZUWzVE/bhxUfcDdXyirKNyRlhhwGA86w7g9/4foh/vYN8XzAo84xJoT2+63hiCL5/1w5zLTlyjJchcAtCLAXRACBcAAAAAAAAAAADDEsTFSOpfmJ+CfN3lrEsBZwTMnEzYyz/moSFIKbmoa3zaWBPR1qOwE4CbEuR7NttPrOuqJgHPaDr0Idg7oKm+W8SZrJl+K0gozKR3Bc7a3/NNMRQAnyOECwAAAAAAAAAAgKEJ4mIgL4HW7XzyRxD2wus8LEbCRd1HgoUjljMvbNV/dwk2v+zNACn9DNRvNddT1M80mYbAd84PqfEArqBeBLF/+qyv32KzdTfY+oiwh/jDDAwxj3POfjYO8EVCuAAAAAAAAAAAABhezrnknHMSpkKnggVxnH7JJWL4kpCldudjI14MQexxaeTSVrT1OLkgDxCqJ2/xzKcHBL61d+ecewrginbOsLf/Qz2DRRuj4skfMq9GMXmi0PyefmngD90AdEkIFwAAAAAAAAAAAGHUAIliJOhJvaQzBfm6paHLAeEuYQp7uVs3irrxay+6GoWw47FYj+ftzVYboBfTX5z0WeYkZAH4uksjAb5fEe2MMQli/6dw7z6i9VtnrbuBvov3FNCupbMgVIDm/M8QAAAAAAAAAAAAEEnO+VIvtk5Gg05EutjSTPBVzrms61qC7RUvSeDUo7qxGok0res6ucQjHLGBOjEFW3dzY88A4Iy9P8qZqLV9v9Vg4h/JOx1o7tyQbsEP3Z0X6/ufaM/rZV3X4nz/11k/Yvj40shnGL3Xe0kpzQOsEf0XNNqHdRiCCtAkIVwAAAAAAAAAAACEI4iLXqzrOqdYQS+lsc8k7IVXl5TS1TAIanszDlE0Fb4ROCDRvgxEVoLV3iaCUVo+EwQ7J0MXZ4YB3iNECnx8dV3X9SKI61dtifqzAs//wP5lgL0yxD7p3Tid7eGLWg6wnf8MAQAAAAAAAAAAABHVvwrsLwPTupdga7K1z1RSvMtoL5adufAP07quU+QBEI7YhCXgvBMCCETvw6K5Ru+5gC4s+WYe4ewT9BmqNyl0AFcS3HKol87XyZSEoEJLfcsl5yxME2BjQrgAAAAAAAAAAAAIq/5ysiAumhQscGPx2cw987QLxcUe4YiN9G/R5uHkcjygDwtHMArQ7Lkw3YIf5oHOPpHPuaHrTeQArlb6q5H2kk/Ot273ikA1DlrvwYRvAexECBcAAAAAAAAAAAChCeKiRcH+snxp+bKVsBf+mAvRg7hCf3/hiE2tx4i920sCiKsE/d6CuIDWzggjBz9EPu+GrDfBA7hChV81pMt3rsHeh/00TWmxR8k3wrcAdiaECwAAAAAAAAAAgPAEcdGgSEEbi89oDnZUL+bAX3+JfMlHOKK9uQHTuq6R9yDAmT0qQVxAC2fBnHOeR96PBRLFqjfRA7hSewGnkXq9a2drZQq+VuDMffHy2oMZDoBjCOECAAAAAAAAAACA9C6IqxgNzlQDNqYgX7f0cIGzfsZoe4Owl8dChja67CMc0ZxsYx4KYgECWwJ/92sNCwE4cs+NGPxQgj/34evNuq7Tuq5rEirUWl/1M9Lg97LO6vuHUD2o95800Ie8hp9egodRA5zif4YAAAAAAAAAAAAAbl6DduoliMmIcJKXQGtu8zAjwVGbz0XjeadWrOtagtWJS+RnLhzx6fGbdhy/aGvxdW8uCSBeDzav6/oSeAim+q5icRk7/bAiYN/zX+B9ZkneCQ9bb+rZ/sUS//VzkJaUYM9mWtf1use78Q3Xy5SCBXDBib2HADiARgjhAgAAAAAAAAAAgD/knC+CuDhDnXdRLDuNn3W78Zi2fCHs5PkbZa4VQQ/CEZ/k0ua2pnVdJ+sSCNyDhQ7iqnVgiXhJW3gKHOaaUsoRv3jQ0O3h600NE3rxXN/1Uy2uvYhn+ybfuwYO4FpsDxw1z4RuAbTpP0MAAAAAAAAAAAAAf6uXH4qR4Cj1cssU5OuWrS8ZBBu/I011bHlfI0qKczEr9AU04YjGr1HGFYjKGf3mZb2ZR/+i67pO67pe11syhwAucA5yBlZvvlxD6vlp8jhvGg5+idjnvfY5U0vrJsV95+CswR49xZJSuuTfZgFcAO0SwgUAAAAAAAAAAAAP1CAuF684SqQLxYvx64qwl/s1Yk7jX85aauBYSNHC/YQjdjc/Z6MABOy/SnI5/t0ZaNQwrnVdZ8EpcKopahBX5DPwKPVG+NY/tfyzjp9R99uUUhNBXHWNh30PbP/ni0r6HbJ1L2zrV+CWuQXQDyFcAAAAAAAAAAAA8A81kOJiJNhTveAyBfm6ZetLB8HG78w5yt+Wwddq9OceKdzvYvz6m58tXNIF0H81UxO6D+N6Dd5a13WtfYQ6RxPnosDfPWwQV/IuuMt6I8DxYy2/5/EOKl1rHzSdsHZe9/vI73GKHaL//S0f6/ImZEvYFsAghHABAAAAAAAAAADAB+ovTrt8xZ4iXXDZ9NJ8vZgk6OWAOSrs5WF9KNbqeIQjGj/9A4D+q9NU+hQ5AAAgAElEQVSefa0BDnMP/Vb9n1XwFo3vOZHPRlPEdwFqTT/1poYHzerIp/Swl0Vfd1M6MIzrTfiW4DpBvwBASikbAgAAAAAAAAAAgHbVSyzDXa7POedOn8eUbhcSMIe2nFeRLrksOefZ+HWr5JwFEt6fh6tn7Zl27LJlCJd+qe/nZ+3pW8F+MeY5rO5H84nPa3pzbhMiueMZ2draZ7y9exir53Su6bfevKknP5L3gcOdS0b9edgTSkrp5w7v043zAOd2PRsA7NATGAIAAAAAAAAAAIB2CeFq8plMyQUsc8h8auK5WY+nCHfxNmK9jh4YIxzR+Fmzp64/IVxAyP7r6Pr/5n8vW/T3f4RsvfJ8TujF1OL9xlv4X8ggLmeb55SU0s/v1Jxa59WUgOvXXvupHu4ra+ltj2YdddKPWStCuAA4hxf5AAAAAAAAAAAADRPC1fSzcQnLHNpiHkW6VLT5ZS+Xsqw/dWEXoS85CUc0fp0qOeeL3kjdhIB123kAvbd1ddh463XH6Tk9c6zdptfdnIRFcawuQyb1bACwvf8MAQAAAAAAAAAAAHxdvbhSjATfVS8URVF2COCazSJztzHLIGs1+vONdNFzj0u4LqifY6oBAQDRXAwBcJT6XmMJPARTDZ/2zKEvS2frbvbIOFDpMYALANiHEC4AAAAAAAAAAAD4JkFcfFcNyogU9LIYv6G8CHu5WxPKADUh9OXiGjAXZW4LRxxwbzYEgP4LYPd9Zw6+70QM4nLOoWdLpwFD+jsOWyOGAAB4JYQLAAAAAAAAAAAAniCIi28KFcC1w2UvQSPmcMs1oVel04uZ5vU39+Yt/2HCEZswCUJr00prrmalmgYQ+Ny3Vd85BfvOFzOfDpWOQ+T0dxy1RophAABeCeECAAAAAAAAAACAJ9XLdy5j8Sn1ouIUaH3Mxm9Iwl4eu3S6VkPXsWChLMIRx+U5wCf2QEMw3HmjOI8Dzn2Hu0YK4qq1ppj26HutOawRAGBcQrgAAAAAAAAAAABgAy7+8gWRgl4uxm9owl4e14NirfZDOKLxG2w+q5Pw2B4hhOi/gLj7TvTwjmhBXBe1Bn3vsd/BY2RHxdkQAPiTEC4AAAAAAAAAAADYiCAuPrKu6xzo625+kSXY+PUyp4W93LdEXqsdEo5o/EYyRQpDgC+e1/SSYz9fZ3HgjLoS/SwVLZxbKBA9KCP0vUJWsZ8DAEcTwgUAAAAAAAAAAAAbEsTFIzUQI9LlxMX4hSDs5XEtWCKu1Q735jnQ1xWOGId6CX9zRvOcAfY4+0Xfd6ZI4dze+2Jf8l0Ygj9IAADcJYQLAAAAAAAAAAAANvbmQlYxGrwRKoBrh4ssAkXM7d5qwRx0rXZDOKLxG9gkIA3ecck61ll8MRLAwQRxxQvi0ldgPzqO3o6t93HhbgDAXUK4AAAAAAAAAAAAYAc551J/mb8YDWpQyRRo/s8bj98cafw6JOzlsUuktdqhSAFSRTii+Q2Bubgf6yw+O4cDB+87Ra1JU333FeWZe+dLiy4jBs/q7XA2BACOIoQLAAAAAAAAAAAAduRSFtU10Hfd4yKLIJH2eUb3a0BpuAZcIj+bgOGIl43Hb07CEXuY51ejAGkZMYwA53CguX1ntu+ka8AgLmhFGbznFZzEVutkNgwAwCNCuAAAAAAAAAAAAGBnLgDHVoNKotj8IosAka7mumd139LoWo1el4QjPkfwXh+mSEEI8OAsNhsF53CAA/ed6K7B+k/PnBaU0fef+g5LEBfPMocAgH8SwgUAAAAAAAAAAAAHqBdh/JJ/MPXiYaSgkmWH8ZvMpG4Ie7m//5fW9v/ol8OFIz49fgL3+uJ5EZlgDJzBAbXneGHeg9XzvmfO2Wf+S5D1NicBqzxRn/1BAgDgI0K4AAAAAAAAAAAA4CD1ooiLWbFECuAqO1xkeTGFuiPs5fH+Xxr5OKHDKIQjbjJ+k1Xd3byfjQIBFZesEY4CnLTvRA8AnCIF96o1nNzvhpp70UPlcTYEAPYlhAsAAAAAAAAAAAAO5GJWHNGCSra+BFUDQyYzqcu5PxuFu1q4iF1qIFhkwhGNX8h5X/sSUHdxBgfYf9+ZUzshzGcRxAX7n/ejzjlrDWsFANiFEC4AAAAAAAAAAAA4mItZYVwDfdc9Qg4EvfRL2Mvjvb8MuFa7IRzx6fGbk3DErvdmQ0Ck3nSHEEKcwQFO68U7NUV6N6DWcKDQoUJ1rQnc5dNnQ0MAAHyWEC4AAAAAAAAAAAA4gYtZY6tBJVGUnPO88fhdzaLuCXu5v/dfTl6rJfgjEI5oXUc2CUhEb4ozuDM4cCh7TkpXQVywea8bfo7Vfr+YDnxUh70LBQC+QggXAAAAAAAAAAAAnCTnXHLOObkwMpR6uTBSUMmyw/hNZlL3hL0ctGa+UHNCX9IUjvj0+AlHHIPniDpL+DN4uoWjOIPTxH4lNDDEnqMuCeKCLc/65tbvtaan418EcAEAXyaECwAAAAAAAAAAAE7mwshwIgVwlR0us7yYQsMQ9nJ/z59P2PNDX/wWjrjJ+E1W7zDrYTYK6E0J3osVZ3DO3qvSLRhCTXb+i+Ql2HMvSRAX2/e55tTfa01Pxz0CuACAbxHCBQAAAAAAAAAAAA1wYWQM0YJKtr78VYNBJjNpqDUxG4W7jgzFKi74C0c0frx9nrVfAb0p5oszOMe75JwFQ6hPEU3rul6DPfeSbkFc1jtbnPPtI3o6Pt9rmQ8AwLcI4QIAAAAAAAAAAIBGuDAyhEgXCjcNEaqBIIJexiPs5f5+Xw7c75fIYy0c8enxm5NwxCH3ZkOA3hR+1U1zh0P2qHxTDEVYAnSCBnF538uze4cArk/3dNYZArgAgKcI4QIAAAAAAAAAAICG1AsjLtZ0qAaVRFFyzlt/X4Eg4/JsH+/3e1tcPhOO+ERdm6zfYU3B+hb0pvCvnmx2BmfP/SndAiHsUfaaYq/51YdOQc//xePniwQKWWdYLwDAgYRwAQAAAAAAAAAAQGNczOtPwKCSPYJeJjNpWMJeHtt1r49+2T/avBOOiOdLYIshYKMzeDEabNnr55wFQvDnXmM+pHQNHMTlfS+fUfKN/eJ768y4xey5PHcA4GlCuAAAAAAAAAAAAKBBgri6EynIouxwqeVqClkjgff6stM/PnQNCRiOeNlh/CardPh1ov6iN4U3fVkNbhDqxrMW4Sn8Y68REHMTNYirJKGPfFxD/Ezg+X1WPxeHAC4AYDNCuAAAAAAAAAAAAKBRgrj6sK7rnAIFlWx9EayOHzHWirCX+/a4GCiQRDjis6zXGKaI4QfoTeGDOTU7h/Pdvr6GbznjcsYZsEchzxxCH/mHixqin+PTitBTAGBrQrgAAAAAAAAAAACgYW+CuIrRaFakoJdNLwjW4I8XUygMYS+P9/ml5bXamzrPIs21rffm2crUx0AnXKxnt/4s55ydw/lsLyZ8i2+cAdWwFDus+01IkFqDMKF991rjOuaaUUcBgM0J4QIAAAAAAAAAAIDG1QvALow0KNplwR0uFQv+iMcz339tLS5upkh786bPWzhiSJPgNTpV1DsO6NEuSXgD/+7DhG/x3f2l2Ft+9aKRg7he3/kupkLMfjaldBEmdMgas9+Ow5oBAHYjhAsAAAAAAAAAAAA64cJIW2pQyRToK1+MHxsQ9rLzGoseAiAc8WkCuGLy3OmRsAqOqrUCUvhr/xG+xUb7i/d83hO8PdeZD/FqyUWo7KH7reCmvpXaf1kzAMBuhHABAAAAAAAAAABAR1zQa0qkwIqy9QWXepmdKti6FvbyYE1sMA9CXygUjrhNn2FHfrc3R1o/1wT9WFy+5oRebQ7Yt/P33iN8i83nlSG4vSeo57nQ7wQEBYVQUkoXteS0NaaX69Ol7o8AALsSwgUAAAAAAAAAAACdqRcOXNI70bquc4oV9GK+HbOuI60hYS/br7UikEQ4IurfE6bowQd01TfNRoGT+3bh2IF6riR8i333lJKELr266kffBQV5FzdePbnU4Gs9hF6OT66b2oN5VgDAIYRwAQAAAAAAAAAAQIfq5U+X9M4TKehlcdHluLEO9F2Fvdzf28t350G0ILc/CUdkx34rUg0UkEgPnIFoomcT4DC8kn6HpcyGgwPOgfYS/ehfZxFhXMPVE+u8vV7O+mp83RgKAOBIQrgAAAAAAAAAAACgU/XijosIB1vX9Rpsns2e+qFjXQJ9ZZdrt5sHLg0KR2TH8Q7W56j7tKzY/2jtTC6Ma8g+KwtL4YT9xD7yux/1ruCPdwTCuPrsW5PwrZ7Wl2fUVi9m3QAApxDCBQAAAAAAAAAAAB0TxHWsdV2nlNIU6CubW8cT9sJX50GJHpYnHJEDeq0S6Cu/1H4H9EnwhVohjKv7veVSw7f0Wahz55sEcd0/Bwrj6kJJwrd6XF/6uAZqoF4MADibEC4AAAAAAAAAAADonCCuQ70E+q7FZbHT1nOkcRf28vw8CH0BVzgiB63JaOP+4qnToEVvSg89XA3dEJLSwXk3vQl7sL/Q0DlQv38zCe1+OE/ehnHZu9qqK8K3BujjkjCuM855wrcAgCYI4QIAAAAAAAAAAIAB1EsiObkgspt6+W8K9JVdGj9vPQt74bPzQFiecESOE2lvngQk0uD+NxsGOuvlXkNSBDk0tJek30EPF/sKje4dxZ7x+6ynJ/2wzggMOt/buuI5DLIPC1U9tCfTjwEAzRDCBQAAAAAAAAAAAAOpl6+KkdhFpKCXxcWx0wl7IaUPLvsFDGx7RzgiB/dYJViPdfXUsf/BNvVDkMOpShK8RX/7hnd7b3pS7wu+XGfMnWN604sAoRDra7a2Nu/LLnoyAKBVQrgAAAAAAAAAAABgMC7rbW9d12uwOTR76qc/g5KEvZgHt7X4aB5cjJBwRI5/DsH6H/0ALSj2P0bq7WqQwyUJ5Nq7XgveQt/pfUHUOnNRZ/bpSd/Ulll/am3xtZr2pi+zdgCAdvs+QwAAAAAAAAAAANCuevF9uICJeumU/efPNaU0jfjdjpxD67pOKdaFP5dh2lnD0ebe4oL8p+dBqZf/1Lgg9E768yh9wbquq1mG/Y+Avd6UUvoRqbfZWEkp/UxC+9Tiwc6cAd8J/HOdRz8DqzPn7Bm1H50NBf9YWy9G4+H60Zvp2UL0bACMw4toAAAAAAAAAACAhgnhYoM5NKUBL+wdHMIVKejFpUZ14GxC4D63D4UeJwF1NDAHIwVFHdobCOHC/ocas77OeYEO/6hNSeiWWhykrkQLH26pL1Vn1BfDwRfW1ZQEclk/ejbvAgDonl9iAgAAAAAAAAAAaJgQLjaaR1MaLKzkqDkkAIlG1rCwF97Og/CXkIQjorc63GH7jhAu7H9w90yaUuxQh+XNvuC8qhZ30dM4/3iGHZ1rpsB1pqRbaFAyr9ihf/sRYO9erB89m3oPwEj8EhMAAAAAAAAAAEDDhHCx4Vya0kBhEQeGcAk/wvo9nks2/5gH0WuocEQamouhwhD0Xtj/oKme8LX+jNgTCdw6f44JdPBOQI/gzJ3SmAFCagxnr6uee7eShNbp2fRsAAzOLzEBAAAAAAAAAAAAAAAAQIf+COZKqf2Ah5JqiENKghwanE8jP49ug3furPPIBCidO/96COda1BisKWtIz6bWA8BXCeECAAAAAAAAAAAAAAAAgAH944L+1mFdJb0J13olvAFg6BozpfsBQnsECy33/o/qDAHW1Jbr6V6/JvAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPg/e3AgAAAAAADk/9oIqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqvxB5XwAAAhUSURBVKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqKu3BAQkAAACAoP+v+xEqAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8BaSBnLTTK2J9wAAAABJRU5ErkJggg==');
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
							[author$project$Logos$navalGroup]),
						_List_Nil),
						A2(
						elm$html$Html$img,
						_List_fromArray(
							[author$project$Logos$sirehna]),
						_List_Nil),
						A2(
						elm$html$Html$img,
						_List_fromArray(
							[author$project$Logos$holiship]),
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