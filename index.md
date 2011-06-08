---
layout: default
---

What is Bigtop?
---------------

Bigtop is a collection of libraries that extend the excellent [Lift] web framework.

[Lift]: http://liftweb.net

The goals of Bigtop are to provide comprehensive and flexible libraries to automate common tasks, and to make it even easier to develop highly interactive web sites using Lift. There is a strong focus on documentation and providing a consistent architecture.

Development Status
------------------

Bigtop is currently in extremely early alpha. There's lots of code and documentation that isn't in place yet. Please bear with us as we get ourselves up and running.

Getting Bigtop
--------------

You currently have two options:

 - Grab the source code from our [Github] repo and build it using SBT:
 
       git clone git://github.com/bigtop/bigtop.git bigtop
       cd bigtop
       sbt update
       sbt publish-local

 - Grab the artefacts directly from our Maven repository:
 
   - Server: `repo.untyped.com`
   - Group: `bigtop`
   - Artefact: `bigtop-foo_2.8.1`
   - Version: `0.1-SNAPSHOT`

   where `foo` is the name of the Bigtop library you need (e.g. `util` or `debug`).
