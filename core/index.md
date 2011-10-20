---
layout: default
title: Bigtop Core
---

Overview
--------

Core provides a set of facilities on which the remainder of Bigtop relies. These are described below.

### Functional URLs

Java's `java.net.URL` class has a number of major drawbacks:

 - it is a mutable data structure;
 - it cannot represent partial or relative URLs;
 - it only provides basic access to data stored in the URL;
 - it only provides basic means for manipulating one URL to produce another.

Bigtop's `bigtop.core.Url` class is designed to address these issues. Here's an example:

{% highlight scala %}
// Construct a Url from a String or a Java URL:
val url1 = Url("http://example.com")

// Manipulate to produce a new Url:
val url2 =
  url1.scheme("https").
       path(List("foo", "bar")).
       set("a", "b", "c")
// ==> Url("https://example.com/foo/bar?a=b&a=c")

// Extract query parameters and other information from the URL:
url2.get("a")    // ==> List("b", "c")
url2.getOne("a") // ==> Some("b")
url2.path        // ==> List("foo", "bar")

// Convert to a java.net.URL:
url2.toURL // => URL("https://example.com/foo/bar?a=b&a=c")
{% endhighlight %}

See the [API reference] for the complete range of functionality.

### URLs &rArr; hyperlinks

The `bigtop.core` package contains an implicit conversion from a `Url` to a `LinkBuilder`, which offers a number of additional conveniences. For example:

{% highlight scala %}
Url("http://example.com").link("Example", "title" -> "Click me")
// ==> <a href="http://example.com" title="Click me">Example</a>

Url("/demos").link(<span><em>awesome</em> demoreel</span>)
// ==> <a href="/demos"><span><em>awesome</em> demoreel</span></a>
{% endhighlight %}

Agaib, see the [API reference] for a complete guide.

[API reference]: http://api.bigtopweb.com
