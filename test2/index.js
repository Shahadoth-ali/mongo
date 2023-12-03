const express=require("express");
const app=express();
const mongoose=require("mongoose");
const port=3000;

app.use(express.json());
app.use(express.urlencoded({extended:true}));

//creating product schema
const productsSchema=new mongoose.Schema({
    title:{
        type:String,
        required:[true,"product title is required"],
    minlength:[3,"min length should be 3"],
    trim:true,//samner r pichoner space remove kre
    
    },
    price:{
        type:Number,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

//creating model
const Products=mongoose.model("Products",productsSchema)

const connectDB=async()=>{
try {
    await   mongoose.connect("mongodb://127.0.0.1:27017/test");
    console.log("database is connected");
} catch (error) {
   console.log("db is not connected");
    console.log(error.message);
    process.exit(1);
}

    // .then(()=>console.log("db is connected"))
    // .catch((error)=>{
    //     console.log("db is not connected");
    //     console.log(error);
    //     process.exit(1);
    // });
}



app.listen(port,async()=>{
    console.log(`server is running at http://localhost:${port}`);
await connectDB();
})

app.get("/",(req,res)=>{
    res.send("hello my world");
})



//creating data
app.post("/products",async(req,res)=>{
  try {
    //getting data from request body
    // const title=req.body.title;
    // const price=req.body.price;
    // const description=req.body.description;

    //storing data
    const newProduct=new Products({
        title:req.body.title,
        price:req.body.price,
        description:req.body.description  
    })
    const productData=await newProduct.save();
    res.status(201).send(productData);
  } catch (error) {
    res.status(500).send({message:error.message})
  }
})

//getting data
app.get("/products",async(req,res)=>{
    try {
  const products=await Products.find();
  if(products){
    res.status(200).send(products);
  }else{
    res.status(404).send({
        message:"products not found"
    })
  }
    } catch (error) {
        res.status(500).send({message:error.message})
    }
})


//searching data
app.get("/products/:id",async(req,res)=>{
    try {
        const id=req.params.id;
  const product=await Products.findOne({_id:id}).select({
    title:1,
    price:1,
    _id:0,
    description:1
  });
res.send(product);
    if(product){
    res.status(200).send(product);
  }else{
    res.status(404).send({
        message:"product not found"
    })
  }
    } catch (error) {
        res.status(500).send({message:error.message})
    }
})

//deleting data
app.delete("/products/:id",async(req,res)=>{
  try {
    const id=req.params.id;
  const product=await Products.deleteOne({_id:id})
  if(product){
    res.status(200).send({
        success:true,
        message:"deleted the product",
        data:product,
    });
  }else{
    res.status(404).send({
        message:"product was not deleted"
    })
  }
  } catch (error) {
    res.status(500).send({message:error.message})
  }
})


//updating data
app.put("/products/:id",async(req,res)=>{
    try {
      const id=req.params.id;
    //   const title=req.body.title;
    //   const description=req.body.description;
  const updatedProduct=await Products.findByIdAndUpdate({_id:id},{
        $set:{
          title:req.body.title,
          price:req.body.price,
          description:req.body.description
        },
      },
      {new:true}
      );
      if(updatedProduct){
        res.status(200).send({
            success:true,
            message:"updated the product",
            data:updatedProduct,
        });
      }else{
        res.status(404).send({
            message:"product was not updated"
        })
      }
    } catch (error) {
        res.status(500).send({message:error.message})
    }
})