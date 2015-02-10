<?php

class Model{
  private $table;
  private $option=array(
    "limit"=>'',
    "where"=>"",
    "order"=>"",
    "group"=>'',
    "having"=>'',
    );
  public function __construct($table){
    $this->table=$table;
    $this->connect();
  }

   function connect(){
    //连接数据库
   mysql_connect(C("DB_HOST"),C("DB_USER"),C('DB_PSD')) or die(halt(mysql_error()));
   //选择数据库
   mysql_select_db(C("DB_NAME"));
   // 设置字符集
 
   mysql_query("SET NAMES ".c('DB_CHARSET'));

   }

   function  where($sql){
    $this->option['where']=" WHERE ". $sql;
     return $this;
   }

     function  limit($sql){
    $this->option['limit']=" LIMIT ". $sql;

     return $this;
   }

     function  order($sql){
    $this->option['order']=" ORDER BY ". $sql;
     return $this;
   }

     function  group($sql){
    $this->option['group']=" GROUP BY ". $sql;
     return $this;
   }

     function  having($sql){
    $this->option['having']=" HAVING ". $sql;
     return $this;
   }
   /**
    * 更新一条新数据
    * @param  [arr] $data [新数据]
    * @return 受影响的条数       [description]
    */
   public function update($data=null){
             if($data=null){
                  if(empty($_POST)){
                     halt('没有更新的数据');
                    return false;
                  } 
                }
                 $data=$_POST;
                $sql=" UPDATE " . $this->table  . ' SET' ;
                foreach($data as $key => $v){
                  $sql.= " ". $key ."=" ." '$v' ,";
                }
               
               $sql= rtrim($sql,",") . $this->option["where"] .$this->option["limit"];
                
              return $this->exe($sql);
    }
  /**
   * 删除语句
   * @return [type] [description]
   */
   function delete(){
     
      $sql="DELETE FROM " .$this->table . $this->option["where"] .$this->option["limit"];
     return $this->exe($sql);
   }
  /**
   * 查询结果集
   * @return [arr] [返回的数组]
   */
   function all(){
   
    $sql="SELECT * FROM " .$this->table . $this->option["where"] . $this->option["group"] . $this->option["having"] . $this->option["order"] . $this->option["limit"];
    return $this->query($sql);
   }
 /**
  * [增加语句]
  */
   function add($data=null){
             if($data=null){
           if(empty($_POST)){
              halt('没有可添加的数据');
                    return false;
                  }
                  
                }
        $data=$_POST;
        $sql="INSERT INTO ". $this->table ;
        $key=array_keys($data);
        $value=array_values($data);
        $key=implode($key, ',');
        $value=implode($value, "','");
        $sql=$sql . "(" . $key .") values ('". $value. "')";
       return $this->exe($sql);
   }
   /**
    * 查询
    * @param  [type] $sql [description]
    * @return [type]      [description]
    */
   function query($sql){
    
    if($result=mysql_query($sql)){
      $result=mysql_query($sql);
      $data=array();
      while($d=mysql_fetch_assoc($result)){
        $data[]=$d;
      }
      return $data;
    }else{
      
    $this->error();
      return false;
    }

   } 
   /**
    * 开启错误调试信息
    * @return [type] [description]
    */
   private function error(){
    if(DEBUG){
      return halt(mysql_error());
    }
   }
  /**
   * 增 删 改
   * @param  [type] $sql [description]
   * @return [type]      [description]
   */
   function exe($sql){
  
    if(mysql_query($sql)){
    
     return mysql_insert_id()?mysql_insert_id():mysql_affected_rows();
    }else{

      $this->error();
      return false;
    }
   }


 /**
  * 查询一条语句
  * @return [arr]一维数组
  */
   public function find(){
    $result=$this->all();
    
    return $result?current($result):$result;
   }
  /**
   * 统计数量
   * @param  string $field [description]
   * @return [type]        [description]
   */
   public function count($field="*"){
    
    $sql="SELECT COUNT({$field}) FROM " .$this->table . $this->option["where"];
    $data=$this->query($sql);
   
   return empty($data)?$data:$data[0]["COUNT(".$field.")"];
   }
}