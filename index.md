---
layout: default
title: Bigtop
---

What's is Bigtop?
-----------------

Bigtop is a collection of web development libraries for Scala programmers. It is intended to complement web frameworks like [Lift] and [Scalatra].

Development Status
------------------

Bigtop is currently in extremely early alpha. There are two semi-stable libraries, plus a number you probably shouldn't dabble with yet.

The stable libraries are:

 - [Bigtop Core](/core) - utilities for generating and manipulating URLs and hyperlinks;
 - [Bigtop Routes](/routes) - bidirectional type-safe mappings between URL paths and Scala code.

We encourage and appreciate any feedback - if you have any suggestions or comments, please get in touch via our [Github] page.

Getting Bigtop
--------------

You currently have two options:

 - Grab the artefacts directly from our [Maven] repository. In SBT 0.11:
 
{% highlight scala %}
resolvers += "Untyped" at "http://repo.untyped.com"

libraryDependencies ++= Seq(
 "bigtop" %% "bigtop-core"   % "0.2-SNAPSHOT",
 "bigtop" %% "bigtop-routes" % "0.2-SNAPSHOT"
)
{% endhighlight %}

 - Grab the source code from our [Github] repo and build it using SBT:

{% highlight bash %}
git clone git://github.com/bigtop/bigtop.git bigtop
cd bigtop
sbt update
sbt publish-local
{% endhighlight %}

Browse the [Maven] repository to find the latest versions and the applicable versions of Scala.

[Lift]: http://liftweb.net
[Scalatra]: https://github.com/scalatra/scalatra
[Github]: https://github.com/bigtop/bigtop
[Maven]: http://repo.untyped.com/bigtop
