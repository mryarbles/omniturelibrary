<?php

class OmnitureLibrary {
	
	protected $_keys;
	protected $_items;
	protected $_sheet = 0;
	protected $_currentSection = "omni";
	protected $cols;
	protected $rows;
	protected $cells;
	
	public function __construct($excel,$keyLine){
		
		$this->_items = array();

		$this->rows = $excel->rowcount($this->_sheet);
		$this->columns = $excel->colcount($this->_sheet);
		
		// get column headers
		// looks like columns are 1 indexed not 0
			
		// loop through the cells and add required values to queryValues
		// start at 2 because 1 is the column names
		$this->cells = $excel->sheets[0]["cells"];
		
		$this->_keys = $this->getKeys($keyLine);
		
		for($row = $keyLine + 1;$row<=$this->rows;$row++){
			
			$obj = new OmnitureItem();
			
			for($col=1; $col<=$this->columns;$col++){
				
				if(isset($this->cells[$row][$col])){
					$val = $this->cells[$row][$col];
				} else {
					$val = "";
				}
				
				if($col == 1 && $val != ""){
					// section found
					$this->_currentSection = $val;
				}
				
				if($val != ""){
					$c = $col - 1;
					$key = $this->_keys[$c];
					
					// create a section specific id 
					if($key == "id"){
						$val = implode("_",explode(".",$val));
						$val = str_replace(" ","",$this->_currentSection) . "_" . $val;
					}
					
					
					$obj->addProperty($key,$val);
				}
			}	
			
			array_push($this->_items,$obj);
		}
	}
	
	/**
	* Get the property keys
	*/
	protected function getKeys($keyLine){
		$row = $this->cells[$keyLine];
		$res = array();
		for($col=1; $col<=$this->columns;$col++){
			$val = $row[$col];
			array_push($res,$val);
		}
		return $res;
	}
	
	/**
	* Get the library output
	*/	
	public function toString(){
		$str = "";

		foreach($this->_items as $item){
			$str .= $item->toString();
		}
		
		return $str;
	}
}

?>