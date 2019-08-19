from notation import mycube

class cube_input_verifier():
	def __init__(self,input):
		self.front = input['f']
		self.back =  input['b']
		self.left =  input['l']
		self.right = input['r']
		self.up =    input['u']
		self.down =  input['d']
		self.faces = [self.front,self.back,self.up,self.down,self.right,self.left]
		self.colors = ['b','g','r','o','w','y']
		self.edge_map = []
		self.corner_map = []
		for i in range(0,6):
			self.edge_map.append([False,False,False,False,False,False])
			self.corner_map.append([False,False,False,False,False,False])
		self.cube = mycube(input)

	def full_verify(self):
		if self.color_verifier() and self.number_of_colors_verifier() and self.cubies_verifier():
			return True
		else:
			return False
	def color_verifier(self):
		
		for face in self.faces:
			for i in range(0,9):
				if face[i] not in self.colors:
					return False
		return True

	def number_of_colors_verifier(self):
		color_count = {'b':0,'g':0,'r':0,'o':0,'w':0,'y':0}
		for face in self.faces:
			for i in range(0,9):
				color_count[face[i]]+=1

		for color in color_count:
			if color_count[color] != 9:
				return False
		return True

	def cubies_verifier(self):
		if self.corners_verifier() and self.edges_verifier():
			return True
		else:
			return False

	def corners_verifier(self):
		color_to_index_mapping = {'b':0,'g':1,'r':2,'o':3,'w':4,'y':5}
		index_to_color_mapping = {0:'b',1:'g',2:'r',3:'o',4:'w',5:'y'}
		mismatching_colors = {'b':'g','g':'b','r':'o','o':'r','w':'y','y':'w'}

		for i in range(1,9):
			colors = self.extract_color(self.cube.get_corner(i))
			index_i = color_to_index_mapping[colors[0]]
			index_j = color_to_index_mapping[colors[1]]
			index_k = color_to_index_mapping[colors[2]]
			self.corner_map[index_i][index_j] = True
			self.corner_map[index_j][index_i] = True
			self.corner_map[index_i][index_k] = True
			self.corner_map[index_k][index_i] = True
			self.corner_map[index_j][index_k] = True
			self.corner_map[index_k][index_j] = True

		for i in range(0,6):
			current_color = index_to_color_mapping[i]
			mismatch_color = mismatching_colors[current_color]
			mismatch_color_index = color_to_index_mapping[mismatch_color]
			for j in range(0,6):
				if i == j and self.corner_map[i][j] == True:
					return False
				elif j == mismatch_color_index and self.corner_map[i][j] == True:
					return False
				elif j != mismatch_color_index and j!=i and self.corner_map[i][j] == False:
					return False
		return True

	def  edges_verifier(self):

		color_to_index_mapping = {'b':0,'g':1,'r':2,'o':3,'w':4,'y':5}
		index_to_color_mapping = {0:'b',1:'g',2:'r',3:'o',4:'w',5:'y'}
		mismatching_colors = {'b':'g','g':'b','r':'o','o':'r','w':'y','y':'w'}
		for i in range(1,13):
			colors = self.extract_color(self.cube.get_edge(i))
			index_i = color_to_index_mapping[colors[0]]
			index_j = color_to_index_mapping[colors[1]]
			self.edge_map[index_i][index_j] = True
			self.edge_map[index_j][index_i] = True

		for i in range(0,6):
			current_color = index_to_color_mapping[i]
			mismatch_color = mismatching_colors[current_color]
			mismatch_color_index = color_to_index_mapping[mismatch_color]
			for j in range(0,6):
				if i == j and self.edge_map[i][j] == True:
					return False
				elif j == mismatch_color_index and self.edge_map[i][j] == True:
					return False
				elif j != mismatch_color_index and j!=i and self.edge_map[i][j] == False:
					return False
		return True

	def extract_color(self,cubie):
		ans = []
		for i in range(0,3):
			if cubie[i] != -1:
				ans.append(cubie[i])

		return ans
		