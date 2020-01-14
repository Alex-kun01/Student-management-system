

//全局变量
var pageAll;//总页数
var pageNumber;//一页显示的数据条数
var nowPage = 1;//当前页数
var tableData = [];//储存获取到的所有学生信息

getStudentData();
//绑定事件的函数
function bindEvent(){
    //左侧菜单栏
    $('.menu-list').on('click','dd',function(){
        $('.active').removeClass('active');
        $(this).addClass('active');
        //获取当前元素的id值
        var id = $(this).attr('data-id');
        $('.content-active').fadeOut().removeClass('content-active');
        $('#'+id).addClass('content-active').fadeIn();
    })

    //添加学生按钮
    $('#sutdent-add-submit').click(function(e){
        e.preventDefault();
        var data = $('.student-add-form').serializeArray();
        var dataObj = formatData(data)
        if(!dataObj){
            alert('请检车数据是否填写完全！');
            return false;
        }else{
            console.log('a');
            $.ajax({
                url:'https://open.duyiedu.com/api/student/addStudent',
                type:'GET',
                // dataType:'json,',
                data:$.extend(dataObj,{
                    appkey:'one_006_1569932435120'
                }),
                dataType:'json',
                success:function(res){
                   if(res.status == 'success'){
                       alert('添加成功！');
                       $('.student-add-form')[0].reset();
                       $('.menu-list > dd[data-id=student-list]').click();
                       $('#table-body > tr').remove();
                       getStudentData();
                   }else{
                       alert(res.msg);
                   }
                }
            })
        }

    })
       //连续添加学生按钮
       $('#sutdent-add-succession').click(function(e){
        e.preventDefault();
        var data = $('.student-add-form').serializeArray();
        var dataObj = formatData(data)
        if(!dataObj){
            alert('请检车数据是否填写完全！');
            return false;
        }else{
            console.log('a');
            $.ajax({
                url:'https://open.duyiedu.com/api/student/addStudent',
                type:'GET',
                // dataType:'json,',
                data:$.extend(dataObj,{
                    appkey:'one_006_1569932435120'
                }),
                dataType:'json',
                success:function(res){
                   if(res.status == 'success'){
                       alert('添加成功！');
                       $('.student-add-form')[0].reset();
                   }else{
                       alert(res.msg);
                   }
                }
            })
        }

    })
    //编辑按钮
    $('#table-body').on('click','.edit',function(){
        var index = $(this).parents('tr').index();
        fillFormData(index);
        //弹出编辑框
        $('.modal').slideDown();

    })
    //关闭 编辑 弹窗
    $('#close').click(function(){
        $('.modal').fadeOut();
    })
    $('.mask').click(function(){
        $('.modal').fadeOut();
    })
    //编辑  修改按钮
    $('#testbtn').click(function(e){
        e.preventDefault();
        var myData = formatForm('.student-edit-form');
        if(myData.msg){
            alert(myData.msg);
        }else{
            $.ajax({
                url:'https://open.duyiedu.com/api/student/updateStudent',
                type:'GET',
                dataType:'json',
                data:$.extend({
                    appkey:'one_006_1569932435120'
                },myData.data),
                success:function(reg){
                    if(reg.status == 'success'){
                        alert('修改成功！');
                        $('.modal').fadeOut();
                        $('#table-body > tr').remove();
                        getStudentData();
                    }else{
                        alert(reg.msg);
                    }
                }
            })
        }
     
    })
    //删除 按钮
    $('#table-body').on('click','.delete',function(e){
        var index = $(this).parents('tr').index();
        var sNo = tableData[index].sNo;
      var isOk = confirm('确认删除？');
      if(isOk){
        deleteStudent(sNo);
      }
    })
    //每页条数按钮
    $('#sure').click(function(){
        pageNumber = parseInt($('#pageNumberTarget').val());
        $('#table-body > tr').remove();
        getStudentData();
    })
    //上下翻页按钮
    //上一页
    $('.prvePage').click(function(){
        if(nowPage > 1){
            nowPage--;
            $('#table-body > tr').remove();
            getStudentData();
            $('#newPage').text(nowPage);
        }
    })
    //下一页
    $('.nextPage').click(function(){
        if(nowPage < pageAll){
            nowPage++;
            $('#table-body > tr').remove();
            getStudentData();
            $('#newPage').text(nowPage);
        }
    })
    //查找按钮
    $('#seach-btn').click(function(){
        searchStudent();
    })

    
}

    //格式化数组结构的表单数据转换为对象类型
    function formatData(data){
        var temp = {};
        var key = true;
        data.forEach(function(item){
            if(!item.value){
                key = false;
            }
            temp[item.name] = item.value;
        })
        return key == true ? temp : false;
    }
    let inde = 1;
   //获取学生列表数据
    function getStudentData(){
       
        pageNumber = parseInt($('#pageNumberTarget').val());
        $.ajax({
            url:'https://open.duyiedu.com/api/student/findByPage',
            type:'GET',
            dataType:'json',
            data:{
                appkey:'one_006_1569932435120',   //one_005_1569680158249
                page:nowPage,
                size:pageNumber
            },
            success:function(res){
                console.log(inde);
                inde++;
                if(res.status == 'success'){
                    tableData = res.data.findByPage;
                    pageAll = Math.ceil(res.data.cont/pageNumber);
                    renderStudentPage(tableData);
                }
                }
             
        })
    }


    //渲染学生列表信息
    function renderStudentPage(res){
        $('#allPage').text(pageAll);
        var tbody = $('#table-body');
        res.forEach(function(item){
            $(`<tr>
            <td>${item.sNo}</td>
            <td>${item.name}</td>
            <td>${item.sex == 0 ? '男' : '女'}</td>
            <td>${item.email}</td>
            <td>${new Date().getFullYear()- item.birth}</td>
            <td>${item.phone}</td>
            <td>${item.address}</td>
            <td>
            <button class="btn edit">编辑</button>
            <button class="btn delete">删除</button>
          </td>
            </tr>`).appendTo(tbody);
        })
        $('.pageNumber2').page({
            curPage:nowPage,
            totalPage:pageAll,
            changeCb:function (page){
                nowPage = page;
                getStudentData();
            }
        })
    }

    //回填编辑表格数据
    function fillFormData(index){
        var studentEditForm = $('.student-edit-form')[0];
        studentEditForm.name.value = tableData[index].name;
        studentEditForm.sex.value = tableData[index].sex;
        studentEditForm.email.value = tableData[index].email;
        studentEditForm.number.value = tableData[index].sNo;
        studentEditForm.birth.value = tableData[index].birth;
        studentEditForm.phone.value = tableData[index].phone;
        studentEditForm.address.value = tableData[index].address;
    }
    //修改学生数据
    function formatForm(targetForm){
        var ruelt = {
            data:{},
            msg:''
        };
        var studentAddForm = $(targetForm)[0];
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
    //删除学生信息
    function deleteStudent(sNo){
        $.ajax({
            url:'https://open.duyiedu.com/api/student/delBySno',
            type:'GET',
            dataType:'json',
            data:{
                appkey:'one_006_1569932435120',
                sNo:sNo
            },
            success:function(reg){
                if(reg.status == 'success'){
                    alert('删除成功');
                    $('#table-body > tr').remove();
                    getStudentData();
                }else{
                    alert(reg.msg);
                }
            }
        })
    }
    //查询学生信息
    function searchStudent(){
        var sex;//All boy girl
        var search = $('#seachIpt').val();//关键字
        if($('select').val() == 'All'){
            sex = -1;
        }else if($('select').val() == 'boy'){
            sex = 0;
        }else{
            sex = 1;
        }
        console.log(sex,search);
        $.ajax({
            url:'https://open.duyiedu.com/api/student/searchStudent',
            type:'GET',
            dataType:'json',
            data:{
                appkey:'one_006_1569932435120',
                sex:sex,
                search:search,
                page:nowPage,
                size:pageNumber
            },
            success:function(reg){
                console.log(reg);
                if(reg.status == 'success'){
                    $('#table-body > tr').remove();
                    renderStudentPage(reg.data.searchList);
                }else{
                    alert(reg.msg);
                    getStudentData();
                }
          
            }
        })
    }

bindEvent();