<template>
 <div>
    <b-table striped hover :fields = datatable.fields :items= datatable.items />
         <b-btn size="sm">Create</b-btn>

  </div>    
</template>

<script>
import { GET_ALL_USERS} from "@/store/actions/user";

  export default {
    data() {
       return {
         datatable:{
        fields:[]
         ,
        items: []
       }
       }
    },

    mounted(){
     console.log("mount")
     this.getData();
     console.log("mounted")


  },
methods:{
  getData(){
    
      this.$store
      .dispatch(GET_ALL_USERS)
      .then((response)=>
      {
        //this.datatable.items = this.$store.getters.getUsers;

      })

      }
}

  }
  
</script>
