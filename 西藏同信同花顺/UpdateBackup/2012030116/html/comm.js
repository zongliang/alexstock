//处理XML的一些公共函数

function PrePage()
{
	thePage="上一页";
	if(g_curPage>0) thePage="<A HREF='#' onclick='Javascript:return PrePageGo()'>上一页</A>";
	return thePage;
}
function PrePageGo()
{
	if(g_curPage > 0) g_curPage--;
	getContent();
}
function NextPage()
{
   thePage="下一页";
   if(g_curPage<g_PagesNumber-1) thePage="<A HREF='#' onclick='Javascript:return NextPageGo()'>下一页</A>";
   return thePage;
}
function NextPageGo()
{
	if(g_curPage < g_PagesNumber-1) g_curPage++;
	getContent();
}
function CurrentPage()
{
	var strCurPage;
	var tt;
	tt = g_curPage;
	tt++;
	strCurPage = "当前是第 "+tt+"/"+g_PagesNumber+" 页";
	return strCurPage;
}
function SelectPage()
{
	var sp;
	sp="<select name='pageNumber' onChange='javascript:ChangePage(this.options[this.selectedIndex].value)'>";
//	sp=sp+"<option value=''></option>";
	   for (t=0;t<g_PagesNumber;t++)
	   {
	       sp=sp+"<option value='"+t+"'";
	       if(t == g_curPage)
	       		sp = sp + "selected";
	       sp = sp + ">"+(t+1)+"</option>";
	   }
   sp=sp+"</select>"
   return sp;
}
function ChangePage(toPage)
{
	g_curPage = toPage;
	getContent();
}
function PageBar()
{
	var strPageBar;
	strPageBar = "<table width='100%'>" + "<tr>";
	strPageBar = strPageBar + "<td width='33%'>" + PrePage()+" "+NextPage()+" </td>";
	strPageBar = strPageBar + "<td width='33%' align='center'>" + CurrentPage() + " </td>";
	strPageBar = strPageBar + "<td align='right'>" +" 跳到第 "+SelectPage()+"页";
	strPageBar = strPageBar + "</tr> </table>";
	return strPageBar;
}
function getContent()
{
	handleData();
}

function sortNodes(nodes, order){
	var  index = new Array();	
	var  sumCount = nodes.length;
	for(var i = 0;i < sumCount; i++){
		index[i] = i;
		var begin = 0;
		var end   = i - 1;
		var cur   = parseInt((end + begin)/2);
		var m = i;
		var cmp1 = cmpTwoItem(nodes, i, index[0], order);
		var cmp2 = cmpTwoItem(nodes, i, index[i-1], order);

		if(cmp1 == 2)
			m = 0;
		else if(cmp2 <= 1)
			m = i;			
		else while(1 && cur >= 0){
			var cmp = cmpTwoItem(nodes, i, index[cur], order);
			if(cmp == 2){
				end = cur;					
			}
			else if(cmp == 1){
				begin = cur;
			}
			else if(cmp == 0){
				m = cur;
				break;
			}
			
			if(begin == end){
				m = begin;
				break;
			}
			else if(end - begin <= 4 && end-begin >=0){						
				var canBreak = false;
				for(var x = begin; x <= end; x++){								
					var cmp3 = cmpTwoItem(nodes, i, index[x], order);
					if(cmp3 == 2)
					{
						m = x;
						canBreak = true;
						break;
					}
				}
				if(canBreak)
					break;
			}
			cur = parseInt((end + begin) /2);
		}
		for(var y = i; y > m; y--)
			index[y] = index[y - 1];

		index[m] = i;
	}
			
	return index;
}

//i ==j = 0，i > j = 1; i < j =2
function cmpTwoItem(nodes,i,j,arg){	
	var ret = 0;
	for(var m = 0; m < arg.length; m++){
		var x1 = nodes.item(i).selectSingleNode('./' + arg[m]);
		var x2 = nodes.item(j).selectSingleNode('./' + arg[m]);
		if(x1 != null && x2 != null){
			var f1, f2;
			if(x1.attributes.getNamedItem("isNaN").text == "1"){	//字符串比较
				f1 = x1.text;
				f2 = x2.text;
			}
			else {
				f1 = parseFloat(x1.text);
				f2 = parseFloat(x2.text);
			}
			
			if(f1 > f2)
				ret = 1;
			else if(f1 < f2)
				ret = 2;

			if(ret != 0)
				break;
		}
	}
	return ret;
}

function AddDate(){
	now = new Date;
	var dstr = "制表时间:" + now.getYear()+"年"+(now.getMonth()+1)+"月"+now.getDate() + "日";
	document.write(dstr);
}

function initArray() {
	this.length = initArray.arguments.length
	for (var i = 0; i < this.length; i++)
		this[i] = initArray.arguments[i]
}

function initTableHead(head){
	g_content += ('<tr bgcolor="#D1E8FC">');
	for(var i = 0;i < head.length; i++){
		g_content += ('<td align="center">' + head[i] + '</td>');
	}
	g_content += ('</tr>');
}

function displayNode(node, cols, fmts){
	var itemContent = "";
	itemContent += ('<tr bgcolor="#FFFFFF">');
	for(var j = 0; j < cols.length; j++){
		itemContent += ('<td ' + fmts[j] + '>');
		var dis = node.selectSingleNode('./' + cols[j]);				
		
		if(dis == null){
			if(j == 0)
				break;
			itemContent += ('&#160');
		}
		else{
			if(j == 0 && dis.text == '-')
				break;
			itemContent += (dis.text);
		}

		itemContent += ('</td>');
	}
	itemContent += ('</tr>');

	if(j == cols.length)
		g_content += itemContent;
}

function displayCell(string, fmt){
	if(fmt == null)
		fmt = 'align="left"';

	g_content += ('<td ' + fmt + '>');
	if(string == null)
		g_content += ("&#160");
	else 
		g_content += (string);
	g_content += ('</td>');
}

function displayTable1(xmlfile, head, cols, fmts, sort, filter){
	g_content += '<table width="100%" align="center" border="1" ' +
				 'cellspacing="0" cellpadding="2" bordercolordark="#ffffff" '+
				 'bordercolorlight="#666666" bgcolor="#f5f5f5">';
	initTableHead(head);
	var xmlDoc = new ActiveXObject("microsoft.xmldom");
	if(xmlDoc == null){
		alert('浏览器不支持XML，请升级到IE5.0');
		return;
	}

	xmlDoc.load(xmlfile);
	var root = xmlDoc.documentElement;	
	var index = sortNodes(root.childNodes, sort);		

	var filterString;
	for(var i = 0;i < root.childNodes.length; i++){
		
		var item = root.childNodes.item(index[i]);
		if(filter != null){
			var filterItem = item.selectSingleNode('./' + filter);
			if(filterItem != null){
				if(filterItem.text != filterString){
					//填汇总数据
					if(filterString != null){
						displaySumItem(root, filterString);
					}
					if(filterItem.text == '-')
						continue;
					filterString = filterItem.text;		
					displaySubHead(filterString, cols.length);
				}
			}
		}
		displayNode(item, cols, fmts);
	}
	displaySumItem(root, filterString);
	g_content += '</table>';
}

function calculateSum(rootElem, filter, itemName){
	var sum   = 0;
	var items = rootElem.selectNodes(filter);
	for(i = 0;i < items.length; i++){
		var one = items.item(i).selectSingleNode('./' + itemName);
		if(one != null)
			sum += parseFloat(one.text);
	}
	return sum;
}

function formatNumber(number, decimal, sep){

	number += 0.00005;
	var string = number.toString(10);
	if(sep == null)
		sep = ',';
	
	if(decimal <= 0)
		decimal = -1;
	
	var dot = string.indexOf(".");
	if(dot != -1)
		string = string.substr(0, dot + decimal + 1);
	else if(decimal > 0){
		string += '.';
		for(var i = 0;i < decimal; i++)
			string += '0';
	}


	return string;
}

function displayTable(xmlfile, head, cols, fmts, sort, filter){
	g_content += '<table width="100%" align="center" border="1" ' +
				 'cellspacing="0" cellpadding="2" bordercolordark="#ffffff" '+
				 'bordercolorlight="#666666" bgcolor="#f5f5f5">';
	initTableHead(head);
	var xmlDoc = new ActiveXObject("microsoft.xmldom");
	if(xmlDoc == null){
		alert('浏览器不支持XML，请升级到IE5.0');
		return;
	}

	xmlDoc.load(xmlfile);
	var root = xmlDoc.documentElement;	
	if(root == null)
	{
		g_content += '</table>';
		return;
	}
	var index = sortNodes(root.childNodes, sort);	
	
	maxLength = root.childNodes.length;
	g_PagesNumber = Math.ceil(maxLength / g_NumberEveryPage);
	startPos = g_NumberEveryPage * g_curPage;
	nextpage = g_curPage;
	nextpage++;
	endPos = g_NumberEveryPage * nextpage;
	if(endPos > maxLength)
		endPos = maxLength;
//document.write(g_curPage+" endPos="+nextpage);	
//document.write(startPos+" endPos="+endPos);
	var filterString;
	for(var i = startPos;i < endPos; i++){
		
		var item = root.childNodes.item(index[i]);
		if(filter != null){
			var filterItem = item.selectSingleNode('./' + filter);
			if(filterItem != null){
				if(filterItem.text != filterString){
					//填汇总数据
					if(filterString != null){
						displaySumItem(root, filterString);
					}
					if(filterItem.text == '-')
						continue;
					filterString = filterItem.text;		
					displaySubHead(filterString, cols.length);
				}
			}
		}
		displayNode(item, cols, fmts);
	}
	displaySumItem(root, filterString);g_content += PageBar();
	g_content += '</table>';
//	alert(g_content);
}