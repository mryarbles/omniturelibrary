<?php 

class OmnitureItem{
	protected $_data;
	public $method;
	public $id;
	protected $_params;
	const SECTION = "section";
	const PAGE = "track";
	const LINK = "trackLink";
	
	public function __construct(){
		$this->_data = array();
		$this->method = self::LINK; // default is track link
		$this->_params = array();
	}
	
	/**
	* Add a property and value to object.
	*/
	public function addProperty($key,$value){
		if(strtolower($key) == "section"){
			$key = strtolower($key);
			$this->method = self::SECTION;
		} else if ($key == "pageName"){
			$this->method = self::PAGE;
		} 
		
		$readyValue = $this->evaluateParams($value);
		
		$this->_data[$key] = $readyValue;
	}
	
	/**
	* Add any new params to params array
	*/
	protected function evaluateParams($str){
		$pattern = '/[<].*?[>]/';
		$tempArr = array();
		preg_match_all($pattern,$str,$tempArr);
		
		if(count($tempArr) > 0){
			$l = count($tempArr[0]);
			$found = false;

			for($i=0;$i < $l; $i++){
				$term = strtolower($tempArr[0][$i]);
				
				foreach($this->_params as $search){
					if($term == $search){
						$found = true;
						break;
					}
				}
				
				if(!$found){
					array_push($this->_params,$term);
				}
			}
		}
		
		return $str;
	}
	
	/**
	* Find and replace params in string with indices.
	*/
	protected function replaceParams($str){
		$res = $str;
		if(count($this->_params) > 0) {
			foreach($this->_params as $key=>$val):
				$replace = "[" . ($key + 1) . "]";
				$regex  = '/' . $val . '/i';
				$res = preg_replace($regex,$replace,$res);
			endforeach;
		}
		return $res;
	}
	
	/**
	* Convert object to string
	*/
	public function toString(){
		$str = "";
		
		if($this->method == self::SECTION){
			$str .= "\n\n//=========================================================================\n";
			$str .= "//\n";
			$str .= "//" . $this->_data["section"] . "\n";
			$str .= "//\n";
			$str .= "//=========================================================================\n\n";
		} else {
			if(isset($this->_data["id"])){
				$str .= "//" . $this->_data["id"] . "\n";
				if(count($this->_params) > 0){
					$str .= "\n// Parameters:\n";
					$c = 1;
					foreach($this->_params as $key=>$param){
						$str .= "//" . $c . " - " . htmlspecialchars($param) . "\n";
						$c++;
					}
					$str .= "\n";
				}
				
				$str .= "obj = omniturelibrary." . $this->_data["id"] . " = {};\n";
				$str .= "obj.method=\"" . $this->method . "\"\n";
				foreach($this->_data as $key=>$val):
					// don't write the id column
					if(strtolower($key) == "notes"){
						$str .= "// Notes: " . $val . "\n";
					} else if($key != "id"){
						$str .= "obj." . $key . "=\"" . $this->replaceParams($val) . "\";\n";
					} 
				endforeach;
				$str .= "\n\n";
			} else {
				echo "no id found\n";
				print_r($this);
			}
			
		}
		
		return $str;
	}
}

?>