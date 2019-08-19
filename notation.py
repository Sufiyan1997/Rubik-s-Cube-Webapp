class mycube():
	
	def __init__(self,c_state):
		self.front = c_state['f']
		self.back =  c_state['b']
		self.left =  c_state['l']
		self.right = c_state['r']
		self.up =    c_state['u']
		self.down =  c_state['d']

	#to rotate any side of the cube, here self is face itself and up right down left is with respect when front face is facing us
	def rotate(self,face,up,right,down,left,name):
		r_face = face[:]
		r_up = up[:]
		r_right = right[:]
		r_down = down[:]
		r_left = left[:]
		
		#required rotations of cells for different sides
		index = { 'f' : [[6,7,8],[0,3,6],[2,1,0],[8,5,2]],
				  'b' : [[2,1,0],[0,3,6],[6,7,8],[8,5,2]],
				  'l' :	[[0,3,6],[0,3,6],[0,3,6],[8,5,2]],
				  'r' : [[8,5,2],[0,3,6],[8,5,2],[8,5,2]],
				  'u' : [[2,1,0],[2,1,0],[2,1,0],[2,1,0]],
				  'd' : [[6,7,8],[6,7,8],[6,7,8],[6,7,8]]
				}

		#update face side of rotation 
		r_face[0] = face[6]
		r_face[1] = face[3]
		r_face[2] = face[0]
		r_face[3] = face[7]
		r_face[4] = face[4]
		r_face[5] = face[1]
		r_face[6] = face[8]
		r_face[7] = face[5]
		r_face[8] = face[2]
		# print(face)
		# print(r_face)

		#update other four sides
		if name == 'b':
			loop = index['b']
		elif name == 'f':
			loop = index['f']
		elif name == 'r':
			loop = index['r']
		elif name == 'l':
			loop = index['l']
		elif name == 'u':
			loop = index['u']
		elif name == 'd':
			loop = index['d']

		r_up[loop[0][0]] = left[loop[3][0]] 
		r_up[loop[0][1]] = left[loop[3][1]] 
		r_up[loop[0][2]] = left[loop[3][2]]

		r_right[loop[1][0]] = up[loop[0][0]] 
		r_right[loop[1][1]] = up[loop[0][1]] 
		r_right[loop[1][2]] = up[loop[0][2]]

		r_down[loop[2][0]] = right[loop[1][0]]
		r_down[loop[2][1]] = right[loop[1][1]]
		r_down[loop[2][2]] = right[loop[1][2]]

		r_left[loop[3][0]] = down[loop[2][0]]
		r_left[loop[3][1]] = down[loop[2][1]]
		r_left[loop[3][2]] = down[loop[2][2]]

		return r_face,r_up,r_right,r_down,r_left

	def r(self):
		# print(self.right)
		self.right,self.up,self.back,self.down,self.front=self.rotate(self.right,self.up,self.back,self.down,self.front,'r')
		# print(self.right)

	def print_cube(self):
		print('Current State of cube:')
		print('front:',self.front)
		print('Back: ',self.back)
		print('left: ',self.left)
		print('right:',self.right)
		print('up:   ',self.up)
		print('down: ',self.down)

	def print_cube_with_faces(self):
		faces = ['front','back','right','left','up','down']
		for i,k in zip([self.front,self.back,self.right,self.left,self.up,self.down],faces):
			print(k)
			for j in range(3):
				print(i[j*3],i[j*3+1],i[j*3+2])

	#move front face(blue) clockwise
	def f(self):
		self.front,self.up,self.right,self.down,self.left=self.rotate(self.front,self.up,self.right,self.down,self.left,'f')

	#move front face(blue) anti-clockwise
	def f1(self):
		self.front,self.up,self.right,self.down,self.left=self.rotate(self.front,self.up,self.right,self.down,self.left,'f')
		self.front,self.up,self.right,self.down,self.left=self.rotate(self.front,self.up,self.right,self.down,self.left,'f')
		self.front,self.up,self.right,self.down,self.left=self.rotate(self.front,self.up,self.right,self.down,self.left,'f')

	#move front(blue) face 2 times
	def f2(self):
		self.front,self.up,self.right,self.down,self.left=self.rotate(self.front,self.up,self.right,self.down,self.left,'f')
		self.front,self.up,self.right,self.down,self.left=self.rotate(self.front,self.up,self.right,self.down,self.left,'f')

	#move up(red) face clockwise
	def u(self):
		self.up,self.back,self.right,self.front,self.left=self.rotate(self.up,self.back,self.right,self.front,self.left,'u')

	#move up(red) face anti-clockwise
	def u1(self):
		self.up,self.back,self.right,self.front,self.left=self.rotate(self.up,self.back,self.right,self.front,self.left,'u')
		self.up,self.back,self.right,self.front,self.left=self.rotate(self.up,self.back,self.right,self.front,self.left,'u')
		self.up,self.back,self.right,self.front,self.left=self.rotate(self.up,self.back,self.right,self.front,self.left,'u')

	#move up(red) face 2-times
	def u2(self):
		self.up,self.back,self.right,self.front,self.left=self.rotate(self.up,self.back,self.right,self.front,self.left,'u')
		self.up,self.back,self.right,self.front,self.left=self.rotate(self.up,self.back,self.right,self.front,self.left,'u')

	#move back(green) face clockwise
	def b(self):
		self.back,self.up,self.left,self.down,self.right=self.rotate(self.back,self.up,self.left,self.down,self.right,'b')

	#move back(green) face anti-clockwise
	def b1(self):
		self.back,self.up,self.left,self.down,self.right=self.rotate(self.back,self.up,self.left,self.down,self.right,'b')
		self.back,self.up,self.left,self.down,self.right=self.rotate(self.back,self.up,self.left,self.down,self.right,'b')
		self.back,self.up,self.left,self.down,self.right=self.rotate(self.back,self.up,self.left,self.down,self.right,'b')

	#move back(green) face 2-times
	def b2(self):
		self.back,self.up,self.left,self.down,self.right=self.rotate(self.back,self.up,self.left,self.down,self.right,'b')
		self.back,self.up,self.left,self.down,self.right=self.rotate(self.back,self.up,self.left,self.down,self.right,'b')

	#move down(orange) face clockwise
	def d(self):
		self.down,self.front,self.right,self.back,self.left=self.rotate(self.down,self.front,self.right,self.back,self.left,'d')

	#move down(orange) face anti-clockwise
	def d1(self):
		self.down,self.front,self.right,self.back,self.left=self.rotate(self.down,self.front,self.right,self.back,self.left,'d')
		self.down,self.front,self.right,self.back,self.left=self.rotate(self.down,self.front,self.right,self.back,self.left,'d')
		self.down,self.front,self.right,self.back,self.left=self.rotate(self.down,self.front,self.right,self.back,self.left,'d')

	#move down(orange) face 2-times
	def d2(self):
		self.down,self.front,self.right,self.back,self.left=self.rotate(self.down,self.front,self.right,self.back,self.left,'d')
		self.down,self.front,self.right,self.back,self.left=self.rotate(self.down,self.front,self.right,self.back,self.left,'d')

	#move left(yellow) face clockwise
	def l(self):
		self.left,self.up,self.front,self.down,self.back=self.rotate(self.left,self.up,self.front,self.down,self.back,'l')

	#move left(yellow) face anti-clockwise
	def l1(self):
		self.left,self.up,self.front,self.down,self.back=self.rotate(self.left,self.up,self.front,self.down,self.back,'l')
		self.left,self.up,self.front,self.down,self.back=self.rotate(self.left,self.up,self.front,self.down,self.back,'l')
		self.left,self.up,self.front,self.down,self.back=self.rotate(self.left,self.up,self.front,self.down,self.back,'l')

	#move left(yellow) face 2-times
	def l2(self):
		self.left,self.up,self.front,self.down,self.back=self.rotate(self.left,self.up,self.front,self.down,self.back,'l')
		self.left,self.up,self.front,self.down,self.back=self.rotate(self.left,self.up,self.front,self.down,self.back,'l')

	#move right(white) face clockwise
	def r(self):
		self.right,self.up,self.back,self.down,self.front=self.rotate(self.right,self.up,self.back,self.down,self.front,'r')

	#move right(white) face anti-clockwise
	def r1(self):
		self.right,self.up,self.back,self.down,self.front=self.rotate(self.right,self.up,self.back,self.down,self.front,'r')
		self.right,self.up,self.back,self.down,self.front=self.rotate(self.right,self.up,self.back,self.down,self.front,'r')
		self.right,self.up,self.back,self.down,self.front=self.rotate(self.right,self.up,self.back,self.down,self.front,'r')

	#move right(white) face 2-times
	def r2(self):
		self.right,self.up,self.back,self.down,self.front=self.rotate(self.right,self.up,self.back,self.down,self.front,'r')
		self.right,self.up,self.back,self.down,self.front=self.rotate(self.right,self.up,self.back,self.down,self.front,'r')

	
	#move center column of front side clockwise wise with respect to right side
	def mf(self):
		faces = [self.front,self.up,self.back,self.down]
		tmp147 = [self.down[1],self.down[4],self.down[7]]
		for i in range(0,4):
			if i<2:
				tmp = [tmp147[0],tmp147[1],tmp147[2]]
				tmp147[0] = faces[i][1]
				tmp147[1] = faces[i][4]
				tmp147[2] = faces[i][7]
				faces[i][1] = tmp[0]
				faces[i][4] = tmp[1]
				faces[i][7] = tmp[2]
			else:
				tmp = [tmp147[0],tmp147[1],tmp147[2]]
				tmp147[0] = faces[i][1]
				tmp147[1] = faces[i][4]
				tmp147[2] = faces[i][7]
				faces[i][7] = tmp[0]
				faces[i][4] = tmp[1]
				faces[i][1] = tmp[2]
	
	#move center column of front side  anti-clockwise wise with respect to right side
	def mf1(self):
		faces = [self.front,self.down,self.back,self.up]
		tmp147 = [self.up[1],self.up[4],self.up[7]]
		for i in range(0,4):
			if i<2:
				tmp = [tmp147[0],tmp147[1],tmp147[2]]
				tmp147[0] = faces[i][1]
				tmp147[1] = faces[i][4]
				tmp147[2] = faces[i][7]
				faces[i][1] = tmp[0]
				faces[i][4] = tmp[1]
				faces[i][7] = tmp[2]
			else:
				tmp = [tmp147[0],tmp147[1],tmp147[2]]
				tmp147[0] = faces[i][1]
				tmp147[1] = faces[i][4]
				tmp147[2] = faces[i][7]
				faces[i][7] = tmp[0]
				faces[i][4] = tmp[1]
				faces[i][1] = tmp[2]
	
	#move center column of front side  2-times with respect to right side
	def mf2(self):
		self.mf()
		self.mf()

	#move center column of right side clockwise wise with respect to back side
	def mr(self):
		faces = [self.right,self.up,self.left,self.down]
		tmp1 = [self.down[3],self.down[4],self.down[5]]
		flag = True
		for i in range(0,4):
			if flag :
				tmp = [tmp1[0],tmp1[1],tmp1[2]]
				tmp1[0] = faces[i][1]
				tmp1[1] = faces[i][4]
				tmp1[2] = faces[i][7]
				faces[i][7] = tmp[0]
				faces[i][4] = tmp[1]
				faces[i][1] = tmp[2]
				flag = False
			elif not flag:
				tmp = [tmp1[0],tmp1[1],tmp1[2]]
				tmp1[0] = faces[i][3]
				tmp1[1] = faces[i][4]
				tmp1[2] = faces[i][5]
				faces[i][3] = tmp[0]
				faces[i][4] = tmp[1]
				faces[i][5] = tmp[2]
				flag = True


	#move center column of right side anti-clockwise wise with respect to back side
	def mr1(self):
		faces = [self.right,self.down,self.left,self.up]
		tmp1 = [self.up[3],self.up[4],self.up[5]]
		flag = True
		for i in range(0,4):
			if flag:
				tmp = [tmp1[0],tmp1[1],tmp1[2]]
				tmp1[0] = faces[i][1]
				tmp1[1] = faces[i][4]
				tmp1[2] = faces[i][7]
				faces[i][1] = tmp[0]
				faces[i][4] = tmp[1]
				faces[i][7] = tmp[2]
				flag = False
			elif (not flag):#1
				tmp = [tmp1[0],tmp1[1],tmp1[2]]
				tmp1[0] = faces[i][3]
				tmp1[1] = faces[i][4]
				tmp1[2] = faces[i][5]
				faces[i][5] = tmp[0]
				faces[i][4] = tmp[1]
				faces[i][3] = tmp[2]
				flag = True

	#move center column of right side 2-times with respect to back side
	def mr2(self):
		self.mr()
		self.mr()

		
	#move center row of front side clockwise wise with respect to down side
	def mc(self):
		faces = [self.front,self.right,self.back,self.left]
		tmp345 = [self.left[3],self.left[4],self.left[5]]
		for i in range(0,4):			
			tmp = [tmp345[0],tmp345[1],tmp345[2]]
			tmp345[0] = faces[i][3]
			tmp345[1] = faces[i][4]
			tmp345[2] = faces[i][5]
			faces[i][3] = tmp[0]
			faces[i][4] = tmp[1]
			faces[i][5] = tmp[2]


	#move center row of front side clockwise wise with respect to down side
	def mc1(self):
		faces = [self.front,self.left,self.back,self.right]
		tmp345 = [self.right[3],self.right[4],self.right[5]]
		for i in range(0,4):
			tmp = [tmp345[0],tmp345[1],tmp345[2]]
			tmp345[0] = faces[i][3]
			tmp345[1] = faces[i][4]
			tmp345[2] = faces[i][5]
			faces[i][3] = tmp[0]
			faces[i][4] = tmp[1]
			faces[i][5] = tmp[2]

	#move center row of front side 2-times with respect to down side
	def mc2(self):
		self.mc()
		self.mc()

	#it 'll give current colors of all the corners with respect to X-axis,Y-axis,Z-axis
	def get_corner(self,no):
		if no == 1:
			return self.left[2],self.up[6],self.front[0]
		elif no == 2:
			return self.right[0],self.up[8],self.front[2]
		elif no == 3:
			return self.right[6],self.down[2],self.front[8]
		elif no == 4:
			return self.left[8],self.down[0],self.front[6]
		elif no == 5:
			return self.left[0],self.up[0],self.back[2]
		elif no == 6:
			return self.right[2],self.up[2],self.back[0]
		elif no == 7:
			return self.right[8],self.down[8],self.back[6]
		elif no == 8:
			return self.left[6],self.down[6],self.back[8]
		else:
			return False,False,False

	#it 'll return colors of asked edge in order with X-axis,Y-axis,Z-axis and when any axis doesn't exist then '-1' will be returned
	def get_edge(self,edgeNum):
		if(edgeNum==1):
			return [-1,self.up[7],self.front[1]]
		if(edgeNum==2):
			return [self.right[3],-1,self.front[5]]
		if(edgeNum==3):
			return [-1,self.down[1],self.front[7]]
		if(edgeNum==4):
			return [self.left[5],-1,self.front[3]]
		if(edgeNum==5):
			return [self.left[1],self.up[3],-1]
		if(edgeNum==6):
			return [self.right[1],self.up[5],-1]
		if(edgeNum==7):
			return [self.right[7],self.down[5],-1]
		if(edgeNum==8):
			return [self.left[7],self.down[3],-1]
		if(edgeNum==9):
			return [-1,self.up[1],self.back[1]]
		if(edgeNum==10):
			return [self.right[5],-1,self.back[3]]
		if(edgeNum==11):
			return [-1,self.down[7],self.back[7]]
		if(edgeNum==12):
			return [self.left[3],-1,self.back[5]]


	#To check wether asked edge is bad or not
	def is_bad_edge(self,no):
		
		x,y,z = self.get_edge(no)
		
		if no == 1 and (y == 'y' or y == 'w' or z == 'o' or z == 'r'):
			return True
		elif no == 2 and (z == 'y' or z == 'w' or x == 'o' or x == 'r'):
			return True
		elif no == 3 and (y == 'y' or y == 'w' or z == 'o' or z == 'r'):
			return True
		elif no == 4 and (z == 'y' or z == 'w' or x == 'o' or x == 'r'):
			return True
		elif no == 5 and (x == 'o' or x == 'r' or y == 'w' or y == 'y'):
			return True
		elif no == 6 and (x == 'o' or x == 'r' or y == 'w' or y == 'y'):
			return True
		elif no == 7 and (x == 'o' or x == 'r' or y == 'y' or y == 'w'):
			return True
		elif no == 8 and (x == 'o' or x == 'r' or y == 'y' or y == 'w'):
			return True
		elif no == 9 and (z == 'o' or z == 'r' or y == 'y' or y == 'w'):
			return True
		elif no == 10 and (z == 'w' or z == 'y' or x == 'o' or x == 'r'):
			return True
		elif no == 11 and (z == 'o' or z == 'r' or y == 'y' or y == 'w'):
			return True
		elif no == 12 and (z == 'w' or z == 'y' or x == 'o' or x == 'r'):
			return True

	#Gives list of all the bad edges currently
	def get_bad_edges(self):
		bad_edges = []
		for i in range(1,13):
			if self.is_bad_edge(i):
				bad_edges.append(i)
		return bad_edges
	
	#check up&down side wether it only contains 'o' or 'r'
	def check_ro_corners(self):
		for i in range(0,9,2):
			if self.up[i] not in ['r','o'] or self.down[i] not in ['r','o']:
				return False
		return True

	#returns number of corner of up&down if it doesn't contain 'r' OR 'o'
	def give_unset_corners(self):
		unset = {'up':[],'down':[]}
		for i in range(0,9,2):
			if self.up[i] not in ['r','o']:
				unset['up'].append(i)
			if self.down[i] not in ['r','o']:
				unset['down'].append(i)
		return unset

	#is cube solved?
	def is_solved(self):
		faces = [self.front,self.back,self.left,self.right,self.up,self.down]

		for face in faces:
			for i in range(0,9):
				if face[i] != face[4]:
					return False

		return True
