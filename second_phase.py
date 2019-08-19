from notation import *

class second_phase(mycube):
	#constructor gets current state (i.e, first stage solved) and initializes the super class (i.e the generic cube)
	def __init__(self,c_state):
		self.up = c_state.up
		self.down = c_state.down
		self.back = c_state.back
		self.front = c_state.front
		self.right = c_state.right
		self.left = c_state.left
		self.ans = []
	#this is basically a controller method which calls other methods eho actually solve the cube and returns the ans for THIS STAGE
	def solve(self):
		self.set_conflicting_corners()
		#print("--------------------------after adjusting corners-----------------------")
		#self.print_cube_with_faces()
		self.set_adjacent_corners_same()
		#print("-----------------------after adjacent corners are same---------------------")
		#self.print_cube_with_faces()
		self.make_sides()
		#print("---------------------------after makng sides-------------------------------")
		return self.ans
	
	#returns conflicting corners (i.e orange on up face or red on down face) of up face if face=0 else returns conflicting corners of down face
	def get_conflicting_corners(self,face):
		
		count = 0
		conflicting_corner=[]
		if face == 0:
			for i in range(0,3,2):
				# print(self.up[0])
				if self.up[i] == 'o':
					conflicting_corner.append(i)
					count+=1
				if self.up[i+6] == 'o':
					count+=1
					conflicting_corner.append(i+6)
		else:
			for i in range(0,3,2):
				if self.down[i] == 'r':
					conflicting_corner.append(i)
					count+=1
				if self.down[i+6] == 'r':
					count+=1
					conflicting_corner.append(i+6)

		return count,conflicting_corner

	#this basically is first step of 2A
	def set_conflicting_corners(self):
		# ans = []
		# self.print_cube_with_faces()
		adjacent_corner = {0:8,2:6,6:2,8:0}
		while True:
			n_conflicting_corners,conflicting_corners = self.get_conflicting_corners(0)
			# print(n_conflicting_corners)
			# print(conflicting_corners)
			#no conflicting corners
			if n_conflicting_corners==0:
				break
			elif n_conflicting_corners==1:
				# self.print_cube_with_faces()
				#rotate down face till upper conflicting corner is in cross-opposite of down-conflicting corner
				while self.down[adjacent_corner[conflicting_corners[0]]] != 'r':
					self.d()
					self.ans.append('d')
				#rotate face having upper-conflicting corner but not having down-conflicting twice
				if conflicting_corners[0] in [0,6]:
					self.l2()
					self.ans.append('l2')
				elif conflicting_corners[0] in [2,8]:
					self.r2()
					self.ans.append('r2')
			elif n_conflicting_corners==2:
				up_conf_corners = conflicting_corners
				n_down_conf_corners,down_conf_corners = self.get_conflicting_corners(1)

				if (self.is_adjacent(up_conf_corners[0],up_conf_corners[1])) and (self.is_adjacent(down_conf_corners[0],down_conf_corners[1])):
					d1 = self.get_down_corner(up_conf_corners[0])
					d2 = self.get_down_corner(up_conf_corners[1])
					#print("in1")
					#rotate to set set conflicting corners of down face to down of conflicting upper corners					
					while not (self.down[d1] == 'r' and self.down[d2] == 'r'):
						self.d()
						self.ans.append('d')
					#rotate face having  all conflicting corners

					if (up_conf_corners[0] in [0,2]) and (up_conf_corners[1] in [0,2]):
						self.b2()
						self.ans.append('b2')
					elif (up_conf_corners[0] in [2,8]) and (up_conf_corners[1] in [2,8]):
						self.r2()
						self.ans.append('r2')
					elif (up_conf_corners[0] in [6,8]) and (up_conf_corners[1] in [6,8]):
						self.f2()
						self.ans.append('f2')
					elif (up_conf_corners[0] in [0,6]) and (up_conf_corners[1] in [0,6]):
						self.l2()
						self.ans.append('l2')
					break	
				elif (self.is_adjacent(up_conf_corners[0],up_conf_corners[1])) and (not self.is_adjacent(down_conf_corners[0],down_conf_corners[1])):
					#print("in2")
					#print(down_conf_corners[0],down_conf_corners[1])
					#rotate face having two upper-conflicting corners
					if (up_conf_corners[0] in [0,2]) and (up_conf_corners[1] in [0,2]):
						self.b2()
						self.ans.append('b2')
					elif (up_conf_corners[0] in [2,8]) and (up_conf_corners[1] in [2,8]):
						self.r2()
						self.ans.append('r2')
					elif (up_conf_corners[0] in [6,8]) and (up_conf_corners[1] in [6,8]):
						self.f2()
						self.ans.append('f2')
					elif (up_conf_corners[0] in [0,6]) and (up_conf_corners[1] in [0,6]):
						self.l2()
						self.ans.append('l2')
				elif ((not self.is_adjacent(up_conf_corners[0],up_conf_corners[1])) and  (self.is_adjacent(down_conf_corners[0],down_conf_corners[1]))):
					#rotate face having two down-conflicting corners
					if ((down_conf_corners[0] in [0,2]) and (down_conf_corners[1] in [0,2])):
						self.f2()
						self.ans.append('f2')
					elif ((down_conf_corners[0] in [2,8]) and (down_conf_corners[1] in [2,8])):
						self.r2()
						self.ans.append('r2')
					elif ((down_conf_corners[0] in [6,8]) and (down_conf_corners[1] in [6,8])):
						self.b2()
						self.ans.append('b2')
					elif ((down_conf_corners[0] in [0,6]) and (down_conf_corners[1] in [0,6])):
						self.l2()
						self.ans.append('l2')
				elif ((not self.is_adjacent(up_conf_corners[0],up_conf_corners[1])) and  (not self.is_adjacent(down_conf_corners[0],down_conf_corners[1]))):
					#make upper conflicting diagonal perpendicular to down conflicting diagonal
					#then rotate face having one upper-conflicting to get case 1 of this else-if ladder
					if up_conf_corners[0] in [0,8]:
						
						if down_conf_corners[0] not in [0,8]:
							self.d()
							self.ans.append('d')
						
						self.r2()
						self.ans.append('r2')

					elif up_conf_corners[0] in [2,6]:
						
						if down_conf_corners[0] not in [2,6]:
							self.d()
							self.ans.append('d')

						self.l2()
						self.ans.append('l2')

			elif n_conflicting_corners==3:
				#get 2 down-conflicting corners opposite to upper conflicting corner
				if (0 not in conflicting_corners) or (6 not in conflicting_corners):
					down_edges = [2,8]
				elif (2 not in conflicting_corners) or (8 not in conflicting_corners):
					down_edges = [0,6]
				#rotate till down corners are conflicting
				while self.down[down_edges[0]] != 'r' and self.down[down_edges[1]] != 'r':
					self.d()
					self.ans.append('d')
				#rotate face having 2 conflicting corners
				if down_edges[0]==2:
					self.r2()
					self.ans.append('r2')
				elif down_edges[0]==0:
					self.l2()
					self.ans.append('l2')
			elif n_conflicting_corners==4:
				self.r2() 
				self.l2()
				self.ans.extend(['r2','l2'])
				break
		return self.ans
	#this makes adjacent corners on front,back,left and right same
	def set_adjacent_corners_same(self):
		#print("here")
		while True:
			# 0 = all mismatch | 1 = 1 match | 2 = all matched
			up_state,down_state = self.get_layer_state()
			#all 9 cases and their solutions
			# print(up_state,down_state)
			# print("in")
			if up_state == 2 and down_state == 2:
				# print([2,2])
				break
			elif up_state == 1 and down_state == 1:
				# print([1,1])
				while self.back[0] != self.back[2]:
					self.u()
					self.ans.append('u')

				while self.front[6] != self.front[8]:
					self.d()
					self.ans.append('d')
				self.do_algo(0)
				
			elif up_state == 0 and down_state == 0:
				# print([0,0])
				self.r2()
				self.f2()
				self.r2()
				self.ans.extend(['r2','f2','r2'])
			elif up_state == 1 and down_state == 0:
				# print([1,0])
				while self.front[0] != self.front[2]:
					self.u()
					self.ans.append('u')
				self.do_algo(0)
			elif up_state == 0 and down_state == 1:
				# print([0,1])
				while self.front[6] != self.front[8]:
					self.d()
					self.ans.append('d')
				self.do_algo(1)
			elif up_state == 0 and down_state == 2:
				# print([0,2])
				self.do_algo(0)
			elif up_state == 2 and down_state == 0:
				# print([2,0])
				self.do_algo(1)
			elif up_state == 1 and down_state == 2:
				# print([1,2])
				while self.back[0] != self.back[2]:
					self.u()
					self.ans.append('u')
				self.do_algo(0)
			elif up_state == 2 and down_state == 1:
				# print([2,1])
				while self.back[6] != self.back[8]:
					self.d()
					self.ans.append('d')
				self.do_algo(1)

	#this checks whether 2 corners are adjacent or not
	def is_adjacent(self,a,b):
		# print(b)
		adjacent_list = {0:[2,6] , 2:[0,8] , 6:[0,8] , 8:[2,6]}
		return (a in adjacent_list[b]) 

	#gives down corners 
	def get_down_corner(self,a):
		down_dic = {0:6,2:8,6:0,8:2}
		return down_dic[a]
	#same as above but for edges
	def get_down_edge(self,edge):
		down_dic = {1:3,3:1,5:8,6:7,7:6,8:5,9:11,11:9}
		return down_dic[edge]
	#make all side faces b/g or w/y 2B
	def make_sides(self):
		edge_face_function_mapping = {1:self.f2,5:self.l2,6:self.r2,9:self.b2}
		edge_face_move_mapping = {1:'f2',5:'l2',6:'r2',9:'b2'}
		top_layer_edges = [1,5,6,9]
		while True:
			#all conflicting edges but non conflicting edges of top layer only
			conf_edges,non_conf_edges = self.get_conflicting_edges()
			n_conf_edges = len(conf_edges)
			# print(n_conf_edges)
			if self.front[0] not in ['b','g']:
				self.u()
				self.ans.append('u')
			if self.front[6] not in ['b','g']:
				self.d()
				self.ans.append('d')
			if n_conf_edges == 0:
				break
			elif n_conf_edges == 2:
				for edge in top_layer_edges:
					if self.is_conf_edge(edge):
						edge_face_function_mapping[edge]()
						self.ans.append(edge_face_move_mapping[edge])
				if self.is_conf_edge(7):
					self.d1()
					self.ans.append('d1')
				elif self.is_conf_edge(8):
					self.d()
					self.ans.append('d')
				self.l2()
				self.r2()
				self.ans.append('l2')
				self.ans.append('r2')
				self.d()
				self.ans.append('d')
					
			else:
				for edge in top_layer_edges:
					if not self.is_conf_edge(edge):
						if self.is_conf_edge(self.get_down_edge(edge)):
							edge_face_function_mapping[edge]()
							self.ans.append(edge_face_move_mapping[edge])
						else:
							self.d2()
							edge_face_function_mapping[edge]()
							self.ans.append('d2')
							self.ans.append(edge_face_move_mapping[edge])
				self.l2()
				self.r2()
				self.d1()
				self.l2()
				self.r2()
				self.d()
				self.ans.append('l2')
				self.ans.append('r2')
				self.ans.append('d1')
				self.ans.append('l2')
				self.ans.append('r2')
				self.ans.append('d')
	#state is how many corners mismatch (used in set_adjacent_corners_same)
	def get_layer_state(self):
		# ans = [0,0]
		up_count = down_count = 0
		mapping = {0:0,1:1,4:2}
		faces = [self.front,self.right,self.back,self.left]
		for face in faces:
			if face[0] == face[2]:
				up_count+=1
			if face[6] == face[8]:
				down_count+=1
		return [mapping[up_count],mapping[down_count]]
	#just a helper function to reduce code in set_adjacent_corners_same
	def do_algo(self,flag):
		if flag == 0:
			self.r1()
			self.f()
			self.r1()
			self.b2()
			self.r()
			self.f1()
			self.r()
			self.ans.extend(['r1','f','r1','b2','r','f1','r'])
		else:
			self.l1()
			self.f()
			self.l1()
			self.b2()
			self.l()
			self.f1()
			self.l()
			self.ans.extend(['l1','f','l1','b2','l','f1','l'])
	#edge is conflicting if it is residing between 2 corners whose color doesn't match with it (e.g. yellow in between b|g)
	def get_conflicting_edges(self):
		conf_edges = []
		n_conf_edges = []
		up_layer_edges = [1,5,6,9]
		all_edges = [1,3,5,6,7,8,9,11]
		for i in all_edges:
			if self.is_conf_edge(i):
				conf_edges.append(i)
			elif i in up_layer_edges:
				n_conf_edges.append(i)
		return [conf_edges,n_conf_edges]
	
	def is_conf_edge(self,edge):
		up_layer_edges = [1,5,6,9]
		down_layer_edges = [3,7,8,11]
		front_edges = [1,3]
		right_edges = [6,7]
		back_edges = [9,11]
		left_edges = [5,8]
		edge_face_mapping = {
								1:self.front,
								3:self.front,
								5:self.left,
								6:self.right,
								7:self.right,
								8:self.left,
								9:self.back,
								11:self.back	
		}
		face = edge_face_mapping[edge]
		if(edge in up_layer_edges):
			if (face[0] in ['b','g'] and face[1] in ['b','g']) or (face[0] in ['w','y'] and face[1] in ['w','y']):
				return False
			else:
				return True
		elif(edge in down_layer_edges):
			if (face[7] in ['b','g'] and face[8] in ['b','g']) or (face[7] in ['w','y'] and face[8] in ['w','y']):
				return False
			else:
				return True	