---
layout: default
title: Bigtop Routes
---

Overview
--------

Routes is a library for creating bidirectional, type-safe mappings between URLs and code. It is compatible with [Lift], [Scalatra], and plain old [Java servlets].

Routes was originally presented by Dave Gurnell at [Scala Lift-Off London][scalalol home] in 2011. Here are a link to a [video of the talk][scalalol talk video], and a link to the [slides and code samples][scalalol talk slides] that Dave refers to.

[Lift]: http://liftweb.net
[Scalatra]: https://github.com/scalatra/scalatra
[Java servlets]: http://java.sun.com/j2ee/tutorial/1_3-fcs/doc/Servlets.html
[scalalol home]: http://skillsmatter.com/event/scala/scala-lift-off-london-2011
[scalalol talk video]: http://skillsmatter.com/podcast/scala/reading-writing-rest
[scalalol talk slides]: https://github.com/davegurnell/scalalol-2011-talk

### URLs &rArr; functions

Routes provides a simple means of dispatching HTTP requests to functions based on the path part of the URL. The programmer constructs a `Site` object made up of one or more `Routes`. Each route consists of a *URL pattern* and a *function*.

For example, this `Calculator` site consists of two routes, `add` and `repeat`:

{% highlight scala %}
object Calculator extends Site {
  
  val add =
    ("add" :/: IntArg :/: "to" :/: IntArg :/: end) >> {
      (a: Int, b: Int) =>
        <html><body>{ a } + { b } = { a + b }</body></html>
    }
  
  val repeat =
    ("repeat" :/: StringArg :/: IntArg :/: "times" :/: end) >> {
      (a: String, b: Int) =>
        <html><body>{ a } * { b } = { a * b }</body></html>
    }
  
}
{% endhighlight %}

The pattern in a route specifies:

 - what the URL should look like, and 
 - a means of extracting typed values from the URL to pass to the function as arguments.

For example, the pattern in the `add` route above responds to URLs of the form:

<pre>
  /add/<strong>1</strong>/to/<strong>2</strong>
</pre>

extracting two integers from the segments highlighted in bold. These integers are passed in order to the route's response function, which returns an informative web page detailing the result of the calculation.

### Functions &rArr; URLs

Routes helps further by providing a way of recreating URLs using the same types of values used in request dispatch. For example, the code:

{% highlight scala %}
Calculator.add.url(1, 2) // ==> bigtop.core.Url("/add/1/to/2")
{% endhighlight %}

produces an instance of `bigtop.core.Url` representing the URL `"/add/1/to/2"`.

Bigtop URLs are immutable structures that allow you to quickly assemble URLs and links to insert into your code in a type-safe fashion. However, if you'd prefer to simply get hold of a string representing your URL, you can call the `path()` method instead:

{% highlight scala %}
Calculator.add.path(1, 2) // ==> "/add/1/to/2"
{% endhighlight %}

Grabbing Routes
---------------

To use Routes in your SBT project, add Bigtop Core and Bigtop Routes to your `build.sbt` file:

{% highlight scala %}
resolvers += "Untyped" at "http://repo.untyped.com"

libraryDependencies ++= Seq(
  "bigtop" %% "bigtop-core"   % "0.2-SNAPSHOT" % "compile",
  "bigtop" %% "bigtop-routes" % "0.2-SNAPSHOT" % "compile"
)
{% endhighlight %}


Routes in Lift
--------------

A [sample Lift project][bigtop lift sample] is available from the Bigtop Github page.

Once your project dependencies are set, the `bigtop.routes.lift` package will give you all the code you need to start using Routes.

Now define your site as in the example at the top of this page. `Routes` in your `Site` should return `LiftResponses`.

Finally, attach your site to `LiftRules.dispatch` in your `Boot` file as follows:

{% highlight scala %}
package bootstrap.liftweb

import code._
import net.liftweb.http._

class Boot {
  
  def boot: Unit = {
    // ...
    
    LiftRules.dispatch.append(Calculator.dispatchPF)
    
    // ...
  }

}
{% endhighlight %}

Because your site is installed using `LiftRules.dispatch`, you can mix Routes and Sitemap using the normal rules for [REST endpoints][lift rest].

[bigtop lift sample]: https://github.com/bigtop/lift-example
[lift rest]: http://simply.liftweb.net/index-Chapter-5.html

Routes in Scalatra
------------------

A [sample Scalatra project][bigtop scalatra sample] is available from the Bigtop Github page.

Once your project dependencies are set, the `bigtop.routes.scalatra` package will give you all the code you need to start using Routes.

Now define your site as in the example at the top of this page. `Routes` in your `Site` can return any response value that Scalatra understands. You can access `ScalatraServlet` functionality via the `kernel` method on the `Site` object. For example, you can use `kernel.pass` to skip to the next `get()` or `post()` statement in your servlet:

{% highlight scala %}
("add" :/: IntArg :/: "to" :/: IntArg :/: end) >> {
  (a: Int, b: Int) =>
    // Skip to the next get() or post() in your servlet:
    kernel.pass
}
{% endhighlight %}

Finally, dispatch to the site from your `ScalatraServlet` by mixing in the `BigtopRoutes` trait:

{% highlight scala %}
import bigtop.routes.scalatra._
import org.scalatra._

class CalculatorServlet extends ScalatraServlet {

  // get("...") { ... }     // other Scalatra endpoints
  
  get(Calculator)           // Bigtop-specific variant of get()

  // get("...") { ... }     // other Scalatra endpoints

}
{% endhighlight %}

Routes in a plain Servlet
-------------------------

Once your project dependencies are set, the `bigtop.routes.scalatra` package will give you all the code you need to start using Routes.

Now define your site as in the example at the top of this page. `Routes` in your `Site` must return `Unit`, but can access the `HttpServletRequest` and `HttpServletResponse` values via `request` and `response` methods in `Site`. For example:

{% highlight scala %}
("add" :/: IntArg :/: "to" :/: IntArg :/: end) >> {
  (a: Int, b: Int) =>
    val content = "%s + %s = %s".format(a, b, a + b)
    response.getWriter.print(content)
}
{% endhighlight %}

Finally, dispatch to the site from your `HttpServlet` by calling its `apply()` method:

{% highlight scala %}
import bigtop.routes.scalatra._
import org.scalatra._

class MyServlet extends HttpServlet {

  def service(req: HttpServletRequest, res: HttpServletResponse) =
    Calculator.apply(req, res)

}
{% endhighlight %}

[bigtop scalatra sample]: https://github.com/bigtop/scalatra-example
[lift rest]: http://simply.liftweb.net/index-Chapter-5.html

Custom Args
-----------

Routes ships with the ability to extract the following data types from a URL:

 - `Ints`    via `bigtop.routes.core.IntArg`
 - `Doubles` via `bigtop.routes.core.DoubleArg`
 - `Strings` via `bigtop.routes.core.StringArg`

However, these data types may not be enough for your needs. You can extract your own data types by creating your own custom subclass of `bigtop.routes.core.Arg[T]`. For example:

{% highlight scala %}
import bigtop.routes.lift._

object BooleanArg extends Arg[Boolean] {
  
  def decode(in: String): Option[Boolean] =
    in.toLowerCase match {
      case "yes"   => Some(true)
      case "true"  => Some(true)
      case "no"    => Some(false)
      case "false" => Some(false)
      case _       => None
    }
  
  def encode(in: Boolean): String =
    if(in) "yes" else "no"
  
}

// Use this in your URL patterns as follows:
("insert" :/: "boolean :/: "here" :/: BooleanArg :/: end)
{% endhighlight %}

You may wish to write a custom `Arg` that does some expensive computation in its `decode()` method. A common example would be parsing a primary key value from the URL and loading the corresponding record from the database.

If so, it is a good idea to override the `Arg.canDecode()` method to provide a rough-and-ready guard that skips the expensive part of the computation. Doing so can provide a speed boost when pattern matching on URLs:

{% highlight scala %}
import bigtop.routes.lift._

class DatabaseArg[T](
  loadRecord: (Int) => Option[T],
  getPrimaryKey: (T) => Int
) extends Arg[T] {
  
  // See if "in" is an integer (quick check):
  override def canDecode(in: String): Boolean =
    try {
      in.toInt
      true
    } catch {
      case _: NumberFormatException => false
    }
  
  // Load a record from the database (expensive):
  def decode(in: String): Option[T] =
    try {
      loadRecord(in.toInt)
    } catch {
      case _: NumberFormatException => None
    }
  
  // Serialize the primary key as a string:
  def encode(in: T): String =
    getPrimaryKey(in).toString
  
}
{% endhighlight %}

Rest-arguments
--------------

URL patterns are typically terminated with the keyword `end`, signifying that the URL must end right there. For example, the route:

{% highlight scala %}
("add" :/: IntArg :/: "to" :/: IntArg :/: end) >> {
  (a: Int, b: Int) =>
    <html><body>{ a } + { b } = { a + b }</body></html>
}
{% endhighlight %}

would match on the URL `"/add/1/to/2"` but not on the URL `"/add/1/to/2/now"`.

You can match on a URL of any length by substituting the `end` keyword for `any`. The tail of the URL is passed to your route function as an extra argument of type `List[String]`. For example, the route:

{% highlight scala %}
("append" :/: any) >> {
  (strings: List[String]) =>
    <html><body>
      append{ strings.mkString("(", ",", ")" } = 
      { strings.mkString }
    </body></html>
}
{% endhighlight %}

would match on any URL starting with `"/append/"`: `"/append/a"`, `"/append/a/b"`, and so on.
