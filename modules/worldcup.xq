let $data := doc('../data/worldcup.xml')

for $n in $data//team
return 
    <root>
        <team id="{string($n/@id)}">
            <cards>{number($n/yc) + number($n/rc)}</cards>
        </team>
    </root>