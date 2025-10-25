function createProduct() {
    if (localStorage.getItem('products') == null) {
        let products = [{
            id: 1,
            status:1,
            title:'Bột Chiên',
            img:'access/image /product/Bột Chiên.JPG',
            category: 'Món ăn vặt',
            price: 40000,
            desc:'Bột chiên giòn rụm, ăn cùng với trứng và đu đủ bào, chấm cùng nước tuong pha chua ngọt. Món ăn vặt thơm ngon đặc trứng của Sài Gòn',
            
        },
        {
            id: 2,
            status:'1',
            title:'Gà Luộc',
            img:'Gà Luộc.jpg',
            category: 'Món mặn',
            price: 200000,
            desc:'Gà luộc thêm ngon, gồm từng miếng gà chặt vừa ăn, da vàng óng, thịt mềm ngọt, ăn kèm rau răm, muối tiêu chanh và dưa leo. Chấm muối tiêu pha chua cay đậm vị Việt, khiến từng miếng gà thêm đậm đà, khó quên. ',
      
        },
         {
            id: 3,
            status:'1',
            title:'Chè Thái',
            img:'access/image /product/Chè Thái.JPG',
            category: 'Món tráng miệng',
            price: 35000,
            desc:'Chè Thái mát lạnh lạnh với nhiều loại trái cây tươi, thạch giòn, mít thơm, nhãn mọng và sầu riêng béo ngậy. Hòa quyện cùng nước cốt dừa ngọt dịu, giải nhiệt tuyệt vời ',
      
        },
        {
            id: 4,
            status:'1',
            title:'Milo Dầm',
            img:'access/image /product/Milo Dầm.PNG',
            category: 'Nước uống',
            price: 30000,
            desc:'',
      
        },
        {
            id: '5',
            status:'1',
            title:'Gỏi Cuốn',
            img:'access/image /product/Gỏi Cuốn.jpg',
            category: 'Món mặn',
            price: 120000,
            desc:'Gỏi cuốn thêm ngon, gồm bánh tráng mềm dai cuốn tôm, thịt luộc, bún, rau sống và hẹ. Ăn kèm nước mắm chua ngọt hoặc tương đậu pha cay, đậm vị Việt, khiến từng cuốn gỏi thanh mát mà vẫn đậm đà, cuốn hút từ cái nhìn đầu tiên.',
      
        },
         {
            id: '6',
            status:'1',
            title:'Gỏi Khô Bò',
            img:'access/image /product/Gỏi Khô Bò.JPG',
            category: 'Món vặt',
            price: 150000,
            desc:'Gỏi khô bò thêm ngon, gồm đu đủ bào sợi giòn mát, khô bò cay ngọt, rau răm thơm nồng, đậu phộng rang và bánh phồng tôm giòn tan. Rưới đều nước mắm pha chua ngọt, cay nhẹ, đậm vị Việt, khiến từng miếng gỏi vừa hài hòa vừa bùng vị, ăn một lần là nhớ mãi.',
      
        },
        {
            id: '7',
            status:'1',
            title:'Bánh Cuốn',
            img:'access/image /product/Gỏi Cuốn.jpg',
            category: 'Món mặn',
            price: 119000,
            desc:'Bánh cuốn mềm mịn, nhân thịt đậm đà, hành phi thơm lừng, chả lụa dai nhẹ, rau sống tươi mát, thêm miếng tôm chiên giòn rụm — chấm nước mắm pha chua ngọt cay cay, đúng là hương vị Việt Nam không thể lẫn vào đâu được.',
        },
        {
            id: '8',
            status:'1',
            title:'Bánh Trán Trộn',
            img:'access/image /product/Bánh Cuốn.jpg',
            category: 'Món vặt',
            price: 59000,
            desc:'Bánh tráng trộn thêm ngon, gồm bánh tráng cắt sợi dai mềm, khô bò cay ngọt, trứng cút béo bùi, xoài xanh chua nhẹ, rau răm thơm nồng, đậu phộng giòn tan và hành phi vàng ruộm. Trộn đều với sa tế, nước tắc, muối tôm đậm vị Việt, khiến từng miếng bánh vừa cay vừa chua, thơm ngon khó cưỡng, ăn là ghiền.',
        },
         {
            id: '9',
            status:'1',
            title:'Há Cảo',
            img:'access/image /product/ha_cao.jpg',
            category: 'Món vặt',
            price: 169000,
            desc:'Há cảo gồm lớp vỏ mỏng dai, nhân tôm thịt ngọt thơm, hấp nóng vừa tới. Ăn kèm nước tương pha chua ngọt, cay nhẹ, rắc thêm hành phi và rau thơm, đậm vị Việt, khiến từng miếng há cảo mềm mại, đậm đà, tan ngay trong miệng.',
        },
          {
            id: '10',
            status:'1',
            title:'Lẩu Thái',
            img:'access/image /product/lau_thai.jpg',
            category: 'Món mặn',
            price: 199000,
            desc:'Lẩu Thái với nước dùng chua cay đặc trưng, thơm nồng mùi sả, lá chanh và ớt tươi. Tôm, mực, thịt bò và rau nhúng được nấu vừa tới, giữ trọn độ ngọt tự nhiên. Khi ăn, chấm cùng nước mắm pha tỏi ớt, thêm chút rau thơm và hành phi, tạo nên hương vị đậm đà, hài hòa giữa vị cay, chua, mặn, ngọt. Từng miếng hải sản mềm ngọt, thấm vị nước lẩu, khiến thực khách xuýt xoa, khó quên.',
        },
        {
            id: '11',
            status:'1',
            title:'Nước Ép Dâu Tây',
            img:'Nước ép dâu tây mát lạnh, đỏ rực như nắng hè, mang hương thơm dịu ngọt đặc trưng của trái cây chín mọng. Từng quả dâu được chọn kỹ, xay nhuyễn cùng chút đường và nước lọc, giữ nguyên vị chua thanh, ngọt nhẹ. Khi uống, cảm nhận lớp nước ép mịn màng, mát lạnh lan tỏa nơi đầu lưỡi, đánh thức mọi giác quan. Thêm vài lá bạc hà và đá viên, ly nước ép trở nên sảng khoái, tươi mới, khiến người thưởng thức như được thả mình giữa vườn dâu mùa hè.',
            category: 'Nước uống',
            price: 29000,
            desc:''
        },
        {
            id: '12',
            status:'1',
            title:'Phá Lấu',
            img:'access/image /product/pha-lau.jpg',
            category: 'Món mặn',
            price: 210000,
            desc:''
        },

      ]
    }
}
function createAdminAccount() {
    let accounts = localStorage.getItem("accounts");
    if(!accounts){
        accounts = [];
        accounts.push({
            fullname:"Lê Thị Ngọc Thảo",
            phone:"NgocThao0412",
            password: "123456@",
            address: 'https://github.com/NgocThao0412',
            email: 'happyhappy123@gmail.com',
            status: 1,
            join: new Date(),
            cart:[],
            usertype: 1
    })
    accounts.push({
        fullname:"Đặng Ngọc Minh Anh",
        phone:"1234567890",
        address:'',
        status: 1,
        join: new Date(),
        cart:[],
        userType:1
    })
    localStorage.setItem('accounts', JSON.stringify(accounts));
    }
    Window.onload = function(){
        createProduct();
        createAdminAccount();
    }
}