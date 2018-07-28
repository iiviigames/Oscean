function Markup(tables)
{
  this.tables = tables;

  this.parse = function(text,force_external = false)
  {
    this.text = text
    this.text = this.text.replace(/{_/g,"<i>").replace(/_}/g,"</i>")
    this.text = this.text.replace(/{\*/g,"<b>").replace(/\*}/g,"</b>")
    this.text = this.text.replace(/{\#/g,"<code class='inline'>").replace(/\#}/g,"</code>")

    var parts = this.text.split("{{")
    for(id in parts){
      var part = parts[id];
      if(part.indexOf("}}") == -1){ continue; }
      var content = part.split("}}")[0];
      if(content.substr(0,1) == "$"){ this.text = this.text.replace(`{{${content}}}`, Ø("operation").request(content.replace("$",""))); continue; }
      if(content.substr(0,1) == "/"){ this.text = this.text.replace(`{{${content}}}`, eval(content.replace("/",""))); continue; }
      var target = content.indexOf("|") > -1 ? content.split("|")[1] : content;
      var name = content.indexOf("|") > -1 ? content.split("|")[0] : content;
      var external = (target.indexOf("https:") > -1 || target.indexOf("http:") > -1 || target.indexOf("dat:") > -1);
      this.text = this.text.replace(`{{${content}}}`,external || force_external ? `<a href='${!external && force_external ? 'https://wiki.xxiivv.com/':''}${target.to_url()}' class='external' target='_blank'>${name}</a>` : `<a class='local' href='#${target.to_url()}' title='${target}' onclick="Ø('query').bang('${target}')">${name}</a>`)
    }
    return this.text;
  }
}

String.prototype.to_markup = function(force_external)
{
  return new Markup().parse(this,force_external);
}

String.prototype.capitalize = function()
{
  return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
}

String.prototype.to_url = function()
{
  return this.toLowerCase().replace(/ /g,"+").replace(/[^0-9a-z\+\:\-]/gi,"").trim();
}

String.prototype.to_path = function()
{
  return this.toLowerCase().replace(/\+/g,".").replace(/ /g,".").replace(/[^0-9a-z\.\-]/gi,"").trim();
}

String.prototype.to_entities = function()
{
  return this.replace(/[\u00A0-\u9999<>\&]/gim, function(i) { return `&#${i.charCodeAt(0)}`; });
}

String.prototype.to_rss = function()
{
  return this.replace(/\</g,"&lt;").replace(/\>/g,"&gt;")
}