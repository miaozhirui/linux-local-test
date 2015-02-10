<?php

//分页类

class Page{
    private $count;//总条数
    private $rows;  //每页显示的条数
    private $pageNum;    // 总的页码数
    private $url;       //url
    private $curren; //当前页
	public function __construct($count,$rows){
     $this->count=$count;
     $this->rows=$rows;
     $this->pageNum=$this->get_pageNum();
     $this->current=isset($_GET["page"])?$_GET["page"]:1;
     $this->url=$this->get_url();

	}
  /**
   * 获得分页的总页数
   * @return [num] [页数]
   */
	private function get_pageNum(){
		
		  return ceil($this->count/$this->rows);
		 
	}
	/**
	 * 获取地址
	 * @return [type] [description]
	 */
  private function get_url(){
      $get=$_GET;
        $str="";
        unset($get["page"]);
      foreach($get as$k=> $v){
      	
         $str.=$k."={$v}&";
      }
      $url=__WEB__."?".$str."page=";
     return $url;
  }

	/**
	 * 首页
	 * @return [type] [description]
	 */
	private function first(){
     if($this->current>1){
        return "<a href=".$this->url."1>首页</a>";
     }else{
     	return "首页";
     }
	}
	/**
	 * 上一页
	 * @return [type] [description]
	 */
   private function pre(){
      if($this->current>1){
        return "<a href=".$this->url.($this->current-1).">上一页</a>";
     }else{
     	return "上一页";
     }
   }
  /**
   * 下一页
   * @return function [description]
   */
   private function next(){
           if($this->current<$this->pageNum){
        return "<a href=".$this->url.($this->current+1).">下一页</a>";
     }else{
     	return "下一页";
     }
   }
  /**
   * 尾页
   * @return [type] [description]
   */
   private function end(){
         if($this->current<$this->pageNum){
        return "<a href=".$this->url.($this->pageNum).">尾页</a>";
     }else{
     	    return '尾页';
     }
   }
   /**
    * 分页样式
    * @return [type] [description]
    */
	private function page_list(){
		$str="";
     for($i=1;$i<=$this->pageNum;$i++){
       if($i==$this->current){
         $str.="<span>{$i}</span>";
       }else{

       $str.="<a href=".$this->url.$i.">{$i}</a>";
     }
   }
       return $this->first().$this->pre().$str.$this->next().$this->end();
	}
  
   public function limit(){
   $star=($this->current-1)*$this->rows;
   return $star.",".$this->rows;
   }
   
   public function show(){
   	  return $this->page_list();
   }
}