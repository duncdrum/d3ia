xquery version "3.0";
declare namespace output = "http://www.w3.org/2010/xslt-xquery-serialization";
declare option output:method "json";
declare option output:media-type "application/json";

declare variable $data := doc('../data/tweets.xml');


declare function local:transform($n as node()*){
for $n in $data/root
return $n
};

local:transform($data)