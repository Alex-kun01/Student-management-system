var tableData = [];//获取表格数据
var select = document.getElementsByTagName('select')[0].value;//获取赛选框内容
var seachBtn = document.getElementById('seach-btn');//搜索按钮
var pageAll;//总页数
var pageNumber;//一页显示的数据条数
var nowPage = 1;//当前页数

//绑定点击事件
function bindEvent (){
    var oDl = document.getElementsByTagName('dl')[0];
    var oDD = document.getElementsByTagName('dd');//菜单列表
    var oEdit = document.getElementById('table-body');
    var close = document.getElementById('close');//编辑页关闭按钮
    var modal = document.getElementsByClassName('modal')[0];//整个遮罩层父级
    var oMask = document.getElementsByClassName('mask')[0];//遮罩层
    var studentAddBtn = document.getElementById('sutdent-add-submit');//add提交按钮
    var studentAddSeuccession = document.getElementById('sutdent-add-succession');//连续添加按钮
    var testbtn = document.getElementById('testbtn');//获取编辑页面 修改按钮
    var tableBodyTr = document.getElementById('table-body').getElementsByTagName('tr');//获取所有的tr 
    var newPage = document.getElementById('newPage');
    var prvePage = document.getElementsByClassName('prvePage')[0];//上一页
    var nextPage = document.getElementsByClassName('nextPage')[0];//下一页
    var sureBtn = document.getElementById('sure');//页数确定按钮
    var pageNumberadd = document.getElementById('pageNumberTarget');//页数input框

    //调节每页多要少条数据
    //每页确定按钮点击事件
    if(!pageNumber){
        pageNumber = pageNumberadd.value;
    }
    sureBtn.addEventListener('click',function(){
        pageNumber = pageNumberadd.value;
        findPage();
        getTableData();
    })


    //事件委托，菜单点击事件
    oDl.addEventListener('click',function(e){
        if(e.target.tagName == "DD"){
            //切换导航
            getPage(oDD,'active',e.target);
            var id = e.target.getAttribute('data-id');//获取菜单栏的自定义属性data-id的值，该值对应着右侧内容区域的id
            var rightContent = document.getElementById(id);//获取右侧存在这个id的内容区
            var contentActive = document.getElementsByClassName('content-active');//获取到存在contmet-active的元素
            //切换右侧内容区域
            getPage(contentActive,'content-active',rightContent);
        }
    });

    //编辑按钮点击事件
    //事件：编辑页面弹出，遮罩层弹出
    oEdit.addEventListener('click',function(e){
        if(e.target.tagName == 'BUTTON'){
            var isEdit = [].slice.call(e.target.classList,0).indexOf('edit') > -1;
            if(isEdit){
                //编辑按钮
                modal.style.display = 'block';
                var index = e.target.getAttribute('data-edit-id');//获取点击的学生的索引值
                console.log('点击学生的索引',index,tableData)
                fillFormData(index);//执行回填数据方法
            }else{
                //点击删除
                var Detindex = e.target.getAttribute('data-delete-id');//获取点击的学生的索引值
                var mysNo = tableBodyTr[Detindex].children[0].innerText;//学号
                deleteStudentData(mysNo);
                findPage();//刷新表格数据
                console.log(Detindex,tableBodyTr,mysNo)

            }
        }
    })


    //翻页点击事件

    //向上翻页
    prvePage.addEventListener('click',function(){
        var key = nowPage > 1 ? true : false;
        if(key){
            nowPage--;
            newPage.innerText = nowPage;
            findPage();
            console.log(nowPage);
        }
    })
    //向下翻页
    nextPage.addEventListener('click',function(){
        var key = nowPage < pageAll ? true : false;
        if(key){
            nowPage++;
            newPage.innerText = nowPage;
            findPage();
            console.log(nowPage);
        }
       

    })





    //回填编辑form数据
    function fillFormData(index){
        var studentEditForm = document.getElementsByClassName('student-edit-form')[0];
        studentEditForm.name.value = tableData[index].name;
        studentEditForm.sex.value = tableData[index].sex;
        studentEditForm.email.value = tableData[index].email;
        studentEditForm.number.value = tableData[index].sNo;
        studentEditForm.birth.value = tableData[index].birth;
        studentEditForm.phone.value = tableData[index].phone;
        studentEditForm.address.value = tableData[index].address;
        console.log(studentEditForm);
    }


    //关闭编辑窗口
    close.addEventListener('click',function(){
        modal.style.display = 'none';
    })
    oMask.addEventListener('click',function(){
        modal.style.display = 'none';
    })

    //添加学生 提交按钮点击事件
    studentAddBtn.addEventListener('click',function(e){
        e.preventDefault();
        var receive = formatForm('student-add-form');//判断添加学生数据函数的返回值接收
        if(receive.msg){
            alert(receive.msg);
            return false;
        }else{
            //提交数据                                 Oject.assing() 方法 拼接对象
            var mydata = saveData('https://open.duyiedu.com/api/student/addStudent',Object.assign({appkey:'one_005_1569680158249'},receive.data));
            if(mydata.status == 'success'){  //status 的返回值为 success 代表添加成功
                alert('添加成功');
                //添加成功后清空form表单数据
                var studentAddForm = document.getElementsByClassName('student-add-form')[0];
                studentAddForm.reset();
                //跳转到学生列表页面
                var studentListPage = document.getElementsByClassName('left-menu')[0].getElementsByTagName('dd')[0];
                findPage();//刷新表格数据
                getTableData();
                studentListPage.click();
            }else{//否则为添加失败 
                alert(mydata.msg);
            }
        }
    })


    //编辑页面修改按钮点击事件
    testbtn.addEventListener('click',function(e){
        e.preventDefault();
       var receive = formatForm('student-edit-form');//获取校验信息
       if(receive.msg){
           alert(receive.msg);
       }else{
           var mydeitdata = saveData('https://open.duyiedu.com/api/student/updateStudent',Object.assign({appkey:'one_005_1569680158249'},receive.data));
           findPage();
           modal.style.display = 'none';
            console.log(mydeitdata);
       }

    })


    //连续添加按钮点击事件
    studentAddSeuccession.addEventListener('click',function(e){
        e.preventDefault();//取消默认事件
        var receive = formatForm('student-add-form');//判断添加学生数据函数的返回值接收
        if(receive.msg){
            alert(receive.msg);
            return false;
        }else{
            //提交数据                                 Oject.assing() 方法 拼接对象
            var mydata = saveData('https://open.duyiedu.com/api/student/addStudent',Object.assign({appkey:'one_005_1569680158249'},receive.data));
            if(mydata.status == 'success'){  //status 的返回值为 success 代表添加成功
                alert('添加成功');
                //添加成功后清空form表单数据
                var studentAddForm = document.getElementsByClassName('student-add-form')[0];
                findPage();//刷新表格数据
                getTableData();
                studentAddForm.reset();
            }else{//否则为添加失败 
                alert(mydata.msg);
            }
            console.log(mydata);
        }
    })

    //删除数据方法
    function deleteStudentData (sNo){
        var mydeleta = saveData('https://open.duyiedu.com/api/student/delBySno',{
            appkey:'one_005_1569680158249',
            sNo:sNo
        });
        if(mydeleta.status == 'success'){
            alert('删除成功!');
            getTableData();
        }
    }

    seachBtn.addEventListener('click',function(){
        var sValue = document.getElementById('seachIpt').value;
        var sValueStr = sValue.toString();
        if(!sValueStr){
            findPage();
        }else{
           var mydata = findtarget(sValueStr);
           console.log(mydata.data.searchList);
           renderTable(mydata.data.searchList);
        }
       
    })

    //按页刷新学生信息
    function findPage(){
        var findData = saveData('https://open.duyiedu.com/api/student/findByPage',{
            appkey:'one_005_1569680158249',
            page:nowPage,
            size:pageNumber
        });
        if(findData.status == 'success'){
            var data = findData.data;
            renderTable(data.findByPage);
            tableData = data.findByPage;
          
        }else{
            alert('请求数据失败！')
        }
        return data;
    }
    findPage();

    //刷新学生列表数据显示
    function getTableData (){
        var getData = saveData('https://open.duyiedu.com/api/student/findAll',{appkey:'one_005_1569680158249'});
        
            if(getData.status == 'success'){
                var data = getData.data;
                pageAll = Math.ceil(data.length / pageNumber);
                var Allpage = document.getElementById('allPage');
                console.log(pageAll);
                Allpage.innerText =pageAll;
                console.log('总条数',data.length)

                // renderTable(data); //渲染页面数据（调用渲染表格数据方法）
                // tableData = data;
            }
            else{
                alert('请求数据失败！')
            }
        }
        getTableData()

    //刷新所有信息
    function refreshPage(){
       var data = saveData('https://open.duyiedu.com/api/student/findAll',{
            appkey:'one_005_1569680158249'
        });
        return data;
    }

    //条件查找方法
    function findtarget (targetData){
        var se = document.getElementsByTagName('select')[0].value;
        var sNO;
        if(se == 'boy'){
            sNO = 0;
        }
        else if(se == 'girl'){
            sNO = 1;
        }
        else{
            sNO = -1;
        }
        var data = saveData('https://open.duyiedu.com/api/student/searchStudent',{
            appkey:'one_005_1569680158249',
            sex:sNO,
            search:targetData,
            page:1,
            size:10

        })
        return data;
      
    }


    }//事件绑定函数结束
    bindEvent();

    //页面/菜单内容切换
    function getPage(listDom,classDom,targetDom){
        for(var i = 0;i < listDom.length;i++){
            listDom[i].classList.remove(classDom);
        }
        targetDom.classList.add(classDom);
    }

    //判断添加学生 提交数据是否填写完全

    function formatForm(targetForm){
        var ruelt = {
            data:{},
            msg:''
        };
        var studentAddForm = document.getElementsByClassName(targetForm)[0];
        var name = studentAddForm.name.value;
        var sex = studentAddForm.sex.value;
        var email = studentAddForm.email.value;
        var sNo = studentAddForm.number.value;
        var birth = studentAddForm.birth.value;
        var phone = studentAddForm.phone.value;
        var address = studentAddForm.address.value;
        if(!name){
            ruelt.msg = '请填写姓名！';
            return ruelt;
        }
        else if(!sex){
            ruelt.msg = '请选择性别！';
            return ruelt;
        }
        else if(!email){
            ruelt.msg = '请填写邮箱！';
            return ruelt;
        }
        else if(!number){
            ruelt.msg = '请填写学号！';
            return ruelt;
        }
        else if(!birth){
            ruelt.msg = '请填写出生年！';
            return ruelt;
        }
        else if(!phone){
            ruelt.msg = '请填写手机号！';
            return ruelt;
        }
        else if(!address){
            ruelt.msg = '请填写住址！';
            return ruelt;
        }
        else{
            ruelt.data = {
                name,
                sex,
                email,
                sNo,
                birth,
                phone,
                address
            }
            return ruelt;
        }

    }


    //渲染表格数据
    function renderTable (targetData){
        console.log(targetData)
        var tBody = document.getElementById('table-body');//获取到表格的身体（tbody 存放数据的表格） 
        var str = '';//拼接所有的字符串
        targetData.forEach(function(ele,index){
            var sex = ele.sex == 0 ? '男' : '女';
            str += '<tr><td>'+ ele.sNo +'</td>\
            <td>'+ ele.name +'</td>\
            <td>'+ sex +'</td>\
            <td>'+ ele.email +'</td>\
            <td>'+ ele.birth +'</td>\
            <td>'+ ele.phone +'</td>\
            <td>'+ ele.address +'</td>\
            <td>\
            <button class="btn edit" data-edit-id="'+ index +'">编辑</button>\
            <button class="btn delete"  data-delete-id="'+ index +'">删除</button>\
            </td></tr>';
           
        });
        tBody.innerHTML = str;//将赋值完毕的str添加到tBody当中去
    }




        //数据交互      
        function saveData(url, param) {
            var result = null;
            var xhr = null;
            if (window.XMLHttpRequest) {
                xhr = new XMLHttpRequest();
            } else {
                xhr = new ActiveXObject('Microsoft.XMLHTTP');
            }
            if (typeof param == 'string') {
                xhr.open('GET', url + '?' + param, false);
            } else if (typeof param == 'object'){
                var str = "";
                for (var prop in param) {
                    str += prop + '=' + param[prop] + '&';
                }
                xhr.open('GET', url + '?' + str, false);
            } else {
                xhr.open('GET', url + '?' + param.toString(), false);
            }
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        result = JSON.parse(xhr.responseText);
                    }
                }
            }
            xhr.send();
            return result;
        }